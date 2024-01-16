import { Resolver, Query, Context, Mutation, Args } from '@nestjs/graphql';
import {UserService} from "./user.service";
import {UseGuards} from "@nestjs/common";
import {GraphqlAuthGuard} from "../auth/graphql-auth.guard";
import {User} from "./user.type";
import {UpdateUserDto} from "./dto/update-user.dto";
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import {Request} from "express";


@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService,
    ) {}

    @UseGuards(GraphqlAuthGuard)
    @Query(() => User)
    async getProfile(
        @Context() context: {req: Request}
    ){
        const userId = context.req.user.id;
        return await this.userService.getProfile(userId);
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => User)
    async updateProfile(
        @Args('profileInput', { nullable: true }) updateUserDto: UpdateUserDto,
        @Args('avatar', { type: () => GraphQLUpload, nullable: true })
            avatar: GraphQLUpload.FileUpload,
        @Context() context: {req: Request},
    ){
        console.log(updateUserDto)
        const userId = context.req.user.id;
        return await this.userService.updateProfile(userId, updateUserDto, avatar)
    }

}
