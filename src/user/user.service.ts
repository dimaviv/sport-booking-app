import {BadRequestException, Injectable, InternalServerErrorException} from '@nestjs/common';
import {UpdateUserDto} from "./dto/update-user.dto";
import {FilesService} from "../files/files.service";
import {RolesService} from "../roles/roles.service";
import {PrismaService} from "../prisma.service";
import {InternalException} from "../../exceptions/validation.exception";
import {User} from "./user.type";
import {AddOwnerInfoInput} from "./dto/add-owner-info.input";
import {RatingService} from "../rating/rating.service";
import {mergeFacilitiesWithRating} from "../utils/arrayMerger";
import * as bcrypt from "bcrypt";
import {v4 as uuidv4} from 'uuid';
import {MailService} from "../mail/mail.service";

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService,
                private readonly ratingService: RatingService,
                private readonly roleService: RolesService,
                private readonly fileService: FilesService,
                private readonly mailService: MailService,
    ) {}

    async getUserFavorites(userId: number, pagination) {
        try {
            let { page, limit } = pagination;
            const offset = (page - 1) * limit;

            const [favorites, totalCount] = await this.prisma.$transaction([
                this.prisma.favorite.findMany({
                    where: {
                        userId: userId,
                    },
                    orderBy: {
                        id: 'desc',
                    },
                    include: {
                        facility: {
                            include: {
                                district: {
                                  include: {
                                      city: true
                                  }
                                },
                                images: {
                                    where: { isMain: true },
                                },
                                _count: {
                                    select: { ratings: true },
                                },
                            },
                        },
                    },
                    skip: offset,
                    take: limit,
                }),
                this.prisma.favorite.count({
                    where: {
                        userId: userId,
                    },
                }),
            ]);

            const facilities = favorites.map(favorite => ({
                ...favorite.facility,
                    currentUserIsFavorite: true,
            }));
            const aggregateRating = await this.ratingService.aggregateRating(null, userId);

            const facilitiesWithRating = await mergeFacilitiesWithRating(facilities, aggregateRating);

            return { totalCount, facilities: facilitiesWithRating };
        } catch (err) {
            throw new InternalServerErrorException(err.message);
        }
    }

    async addFavorite(userId: number, facilityId: number): Promise<boolean> {
        try {

            const existingFavorite = await this.prisma.favorite.findFirst({
                where: {
                    userId: userId,
                    facilityId: facilityId,
                },
            });

            if (existingFavorite) {
                throw new BadRequestException('This facility is already in your favorites.');
            }

           await this.prisma.favorite.create({
                data: {
                    userId: userId,
                    facilityId: facilityId,
                },
            });

            return true;
        } catch (err) {
            if (err instanceof BadRequestException) {
                throw err;
            }
            throw new InternalServerErrorException(err.message);
        }
    }

    async removeFavorite(userId: number, facilityId: number): Promise<boolean> {
        try {
            const favorite = await this.prisma.favorite.findFirst({
                where: {
                    userId: userId,
                    facilityId: facilityId,
                },
            });

            if (!favorite) {
                throw new BadRequestException('This facility is not in your favorites.');
            }

            await this.prisma.favorite.delete({
                where: {
                    id: favorite.id,
                },
            });

            return true;
        } catch (err) {
            if (err instanceof BadRequestException) {
                throw err;
            }
            throw new InternalServerErrorException(err.message);
        }
    }

    async addOwnerInfo(ownerInfo: AddOwnerInfoInput, userId: number) {
        try {
            const userOwner = await this.prisma.userOwner.create({data: {...ownerInfo, userId},})
            const {role} = await this.roleService.getRoleByValue('OWNER')

            const user = await this.prisma.user.update({
                where:{ id: userId },
                data: {
                    roles: {
                        connect:{
                            id: role.id
                        }
                    }
                },
                include: {
                    roles: true,
                },
            })

            if (!user) throw new BadRequestException('User not found');

            return {...user, userOwner}

        } catch (err) {
            if (err instanceof BadRequestException){
                throw err;
            }
            throw new InternalException(err.message);
        }
    }

    // OAuth
    async findByOAuthId(oauthId: string) {
        return this.prisma.user.findFirst({
            where: {
                OR: [
                    {
                        googleId: oauthId,
                    },
                    {
                        facebookId: oauthId,
                    },
                ],
            },
            include: {roles:true}
        });
    }

    async createUserFromOAuthData(profile: any): Promise<User> {
        const {role} = await this.roleService.getRoleByValue('USER')
        const userInput  = {
            googleId: profile.id,
            facebookId: profile.facebookId,
            fullname: profile.name,
            email: profile.email,
            avatar: profile.picture,
            isActivated: true,
            password: null,
            activationLink: null,
            roles: {
                connect:{
                    id: role.id
                }
            }
        };

        const candidate = await this.prisma.user.findUnique({
            where: {email: profile.email}
        });
        if (candidate) {
            throw new BadRequestException("Email already in use");
        }

        return this.prisma.user.create({
            data: {...userInput},
            include: {
                roles: true,
            },
        });
}

    // User profile
    async updateProfile(userId:number, dto: UpdateUserDto, avatarFile: any) {
        try {
            let updateData
            if (dto) updateData = {...dto, avatar:undefined};

            if (avatarFile) {
                updateData.avatar = await this.fileService.saveAvatar(avatarFile)
            }
            if (avatarFile === null) updateData.avatar = null

            return await this.prisma.user.update({
                where: {id: userId},
                data: {
                    ...updateData
                }
            })
        } catch (err) {
            throw new InternalException(err.message);
        }

    }

    async getProfile(userId:number) {
        try {
            const user = await this.prisma.user.findUnique({where:{id:userId}, include: {userOwner: true, roles: true},})
            if (!user) throw new BadRequestException('User not found');

            return {...user}
        } catch (err) {
            throw new InternalException(err.message);
        }
    }

    async findUserById(id: number){
        return this.prisma.user.findUnique({where: {id}})
    }

    async verifyEmailToken(token: string): Promise<boolean> {
        try {
            const user = await this.prisma.user.findUnique({
                where: { activationLink: token },
            });

            if (!user) {
                throw new BadRequestException('Invalid or expired token.');
            }

            if (user.isActivated) {
                return false;
            }

            await this.prisma.user.update({
                where: { id: user.id },
                data: { isActivated: true },
            });

            return true;
        } catch (error) {
            console.error('Error verifying email token:', error);
            throw new BadRequestException('Invalid or expired token.');
        }
    }


    async sendRestorePasswordEmail(email: string): Promise<void> {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new BadRequestException('User with this email does not exist.');
        }

        const token = await uuidv4();
        const expiresAt = new Date();
        expiresAt.setHours(expiresAt.getHours() + 1); // Token valid for 1 hour

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                restorePasswordToken: token,
                tokenExpiresAt: expiresAt,
            },
        });

        const restoreURL = `${process.env.API_URL}/user/restore-password?token=${token}`;

        await this.mailService.sendRestorePasswordMail(user.email, restoreURL);
    }

    async resetPassword(token: string, newPassword: string): Promise<boolean> {
        const user = await this.prisma.user.findUnique({
            where: { restorePasswordToken: token },
        });

        if (!user) {
            throw new BadRequestException('Invalid or expired token.');
        }

        if (user.tokenExpiresAt && new Date() > user.tokenExpiresAt) {
            throw new BadRequestException('Token has expired.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                restorePasswordToken: null,
                tokenExpiresAt: null,
            },
        });

        return true;
    }


    async changePassword(userId: number, oldPassword: string, newPassword: string): Promise<User> {
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
        });

        if (!user) {
            throw new BadRequestException('User not found.');
        }

        const isMatch = await bcrypt.compare(oldPassword, user.password);
        if (!isMatch) {
            throw new BadRequestException('Old password is incorrect.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        return await this.prisma.user.update({
            where: { id: userId },
            data: { password: hashedPassword },
        });
    }






}
