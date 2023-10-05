import {Args, Mutation, Query, Resolver} from '@nestjs/graphql';
import {PrismaService} from "../prisma.service";
import {RolesService} from "./roles.service";
import {RoleDto} from "./dto";
import {RoleResponse} from "./types";


@Resolver()
export class RolesResolver {

    constructor(
        private readonly prisma: PrismaService,
        private readonly roleService: RolesService,
    ) {}

    @Mutation(() => RoleResponse)
    async create(
        @Args('roleInput') roleDto: RoleDto) {
        return this.roleService.createRole(roleDto);
    }

    @Query(() => RoleResponse)
    async getByValue(
        @Args('name') name: string){
        return await this.roleService.getRoleByValue(name);
    }
}
