import {BadRequestException, Injectable} from '@nestjs/common';
import {UpdateUserDto} from "./dto/update-user.dto";
import {FilesService} from "../files/files.service";
import {RolesService} from "../roles/roles.service";
import {PrismaService} from "../prisma.service";
import {InternalException} from "../../exceptions/validation.exception";
import {User} from "./user.type";

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService,
                private readonly roleService: RolesService,
                private readonly fileService: FilesService,
    ) {}

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
            if (dto){
                 updateData = {...dto, avatar:undefined};
            }

            if (avatarFile) {
                updateData.avatar = await this.fileService.saveAvatar(avatarFile)
            }
            updateData.dateOfBirth = new Date(updateData.dateOfBirth)
            console.log(updateData)
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
            const user = await this.prisma.user.findUnique({where:{id:userId}})
            if (!user) throw new BadRequestException('User not found');

            return user

        } catch (err) {
            throw new InternalException(err.message);
        }
    }

    async findUserById(id: number){
        return this.prisma.user.findUnique({where: {id}})
    }

}
