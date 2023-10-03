import { Injectable } from '@nestjs/common';
import {PrismaService} from "../prisma.service";


@Injectable()
export class RolesService {
    constructor(
        private readonly prisma: PrismaService
    ) {}

    async createRole(dto){
        const role = await this.prisma.role.create({data: {...dto}});
        return {role};
    }

    async getRoleByValue(value: string){
        const role = await this.prisma.role.findUnique({where:{value:value}})
        return {role}
    }
}
