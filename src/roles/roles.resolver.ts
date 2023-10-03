import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {PrismaService} from "../prisma.service";
import {LoginResponse} from "../auth/types";
import {LoginDto, RegisterDto} from "../auth/dto";
import {Request, Response} from "express";
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
