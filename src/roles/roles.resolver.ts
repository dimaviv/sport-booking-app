import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {PrismaService} from "../prisma.service";
import {RolesService} from "./roles.service";
import {RoleDto} from "./dto";
import {RoleResponse} from "./types";
import {UseGuards} from "@nestjs/common";
import {RolesGuard} from "../auth/roles.guard";
import {Roles} from "../auth/roles-auth.decorator";


@Resolver()
export class RolesResolver {

    constructor(
        private readonly prisma: PrismaService,
        private readonly roleService: RolesService,
    ) {}


    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Mutation(() => RoleResponse)
    async create(
        @Args('roleInput') roleDto: RoleDto) {
        return this.roleService.createRole(roleDto);
    }


    @UseGuards(RolesGuard)
    @Roles('ADMIN')
    @Query(() => RoleResponse)
    async getByValue(
        @Args('name') name: string){
        return await this.roleService.getRoleByValue(name);
    }
}
