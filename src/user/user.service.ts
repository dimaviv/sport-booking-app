import {BadRequestException, Injectable} from '@nestjs/common';
import {UpdateUserDto} from "./dto/update-user.dto";
import {FilesService} from "../files/files.service";
import {RolesService} from "../roles/roles.service";
import {PrismaService} from "../prisma.service";
import {InternalException} from "../../exceptions/validation.exception";

@Injectable()
export class UserService {

    constructor(private readonly prisma: PrismaService,
                private readonly roleService: RolesService,
                private readonly fileService: FilesService,
    ) {}

    async updateProfile(userId:number, dto: UpdateUserDto, avatarFile: any) {
        try {
            let updateData = {...dto, avatar:undefined};
            if (avatarFile) {
                const fileName = await this.fileService.saveAvatar(avatarFile);
                updateData.avatar = fileName
            }

            return await this.prisma.user.update({
                where: {id: userId},
                data:{
                    ...updateData
                }
            });
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



    // async createUser(dto: CreateUserDto, activationLink: string){
    //     const user = await this.prisma.user.create({...dto, activationLink:activationLink});
    //     const role = await this.roleService.getRoleByValue('USER')
    //     await user.$set('roles', [role.id])
    //     user.roles = [role]
    //     return user;
    //
    // }


    // async addRole(dto: AddRoleDto){
    //     const user = await this.userRepository.findByPk(dto.userId)
    //     const role = await this.roleService.getRoleByValue(dto.value);
    //     if (role && user){
    //         await user.$add('role', role.id)
    //         return dto;
    //     }
    //     throw new HttpException('User or role wasn\'t found', HttpStatus.NOT_FOUND)
    // }
    //
    // async ban(dto: BanUserDto) {
    //     const user = await this.userRepository.findByPk(dto.userId)
    //     if (!user){
    //         throw new HttpException('User wasn\'t found', HttpStatus.NOT_FOUND)
    //     }
    //     user.banned = true;
    //     user.banReason = dto.banReason;
    //     await user.save();
    //     return user;
    // }


}
