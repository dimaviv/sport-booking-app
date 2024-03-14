import {Resolver, Query, Context, Mutation, Args, Int} from '@nestjs/graphql';
import {UserService} from "./user.service";
import {UseGuards} from "@nestjs/common";
import {GraphqlAuthGuard} from "../auth/graphql-auth.guard";
import {User, UserOwner} from "./user.type";
import {UpdateUserDto} from "./dto/update-user.dto";
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import {Request} from "express";
import {AddOwnerInfoInput} from "./dto/add-owner-info.input";
import {FacilitiesResponse, Facility} from "../facility/facility.types";
import {PaginationArgs} from "../common/pagination/pagination.args";



@Resolver()
export class UserResolver {
    constructor(
        private readonly userService: UserService,
    ) {}

    @UseGuards(GraphqlAuthGuard)
    @Query(() => FacilitiesResponse)
    async getUserFavorites(
        @Args('paginationArgs', {nullable: true}) paginationArgs: PaginationArgs,
        @Context() context: { req: Request }
    ){
        const userId = context.req.user.id;
        return this.userService.getUserFavorites(userId, paginationArgs);
    }


    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => Boolean)
    async addFavorite(
        @Args('facilityId', { type: () => Int }) facilityId: number,
        @Context() context: { req: Request }
    ){
        const userId = context.req.user.id;
        return await this.userService.addFavorite(userId, facilityId);
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => Boolean)
    async removeFavorite(
        @Args('facilityId', { type: () => Int }) facilityId: number,
        @Context() context: { req: Request }
    ){
        const userId = context.req.user.id;
        return await this.userService.removeFavorite(userId, facilityId);
    }


    @UseGuards(GraphqlAuthGuard)
    @Mutation(() => User)
    async addOwnerInfo(@Args('ownerInfo') ownerInfo: AddOwnerInfoInput,
        @Context() context: {req: Request}
    ){
        const userId = context.req.user.id;
        return await this.userService.addOwnerInfo(ownerInfo, userId);
    }

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
        const userId = context.req.user.id;
        return await this.userService.updateProfile(userId, updateUserDto, avatar)
    }

}
