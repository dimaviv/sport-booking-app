import {Args, Context, Int, Mutation, Query, Resolver} from '@nestjs/graphql';
import {FacilityService} from './facility.service';
import {CreateFacilityInput} from './dto/create-facility.input';
import {UpdateFacilityInput} from './dto/update-facility.input';
import {CreateFacilityResponse, FacilitiesResponse, Facility, TimeSlot, UpdateFacilityResponse, Image} from "./facility.types";
import {UseGuards} from "@nestjs/common";
import {GraphqlAuthGuard} from "../auth/graphql-auth.guard";
import {Request} from "express";
import {UnauthorizedException} from "../../exceptions/validation.exception";
import {FacilitiesFilterInput} from "./dto/facilities-filter.input";
import {PaginationArgs} from "../common/pagination/pagination.args";
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import {CreateScheduleInput} from "./dto/create-schedule.input";
import {UpdateTimeSlotsInput} from "./dto/update-time-slots.input";
import {GraphqlAuthCheck} from "../auth/graphql-auth-check.guard";
import {RolesGuard} from "../auth/roles.guard";
import {Roles} from "../auth/roles-auth.decorator";


@Resolver(() => Facility)
export class FacilityResolver {
  constructor(private readonly facilityService: FacilityService) {}


  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => [TimeSlot])
  async createSchedule(@Args('createScheduleInput') createScheduleInput: CreateScheduleInput,
                       @Context() context: {req: Request}) {

    if (!context.req.user.roles.includes('OWNER')) throw new UnauthorizedException('User is not authorized as an owner')

    return this.facilityService.createSchedule(createScheduleInput, context.req.user.id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteSchedule(@Args('facilityId') facilityId: number,
                       @Context() context: {req: Request}) {

    if (!context.req.user.roles.includes('OWNER')) {
      throw new UnauthorizedException('User is not authorized as an owner');
    }

    return this.facilityService.deleteSchedule(facilityId, context.req.user.id);
  }


  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => [TimeSlot])
  async updateTimeSlots(@Args('updateTimeSlotsInput', {nullable: true}) updateTimeSlotsInput: UpdateTimeSlotsInput,
                        @Context() context: {req: Request}){

    if (!context.req.user.roles.includes('OWNER')) throw new UnauthorizedException("User is not authorized as an owner")

    return this.facilityService.updateTimeSlots(updateTimeSlotsInput, context.req.user.id);
  }


  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => CreateFacilityResponse)
  async createFacility(@Args('createFacilityInput') createFacilityInput: CreateFacilityInput,
                 @Args('photo', { type: () => GraphQLUpload, nullable: true })
                     photo: GraphQLUpload.FileUpload,
                 @Context() context: {req: Request}) {

    if (!context.req.user.roles.includes('OWNER')) throw new UnauthorizedException("User can not be the owner")

    return this.facilityService.create(createFacilityInput, context.req.user.id, photo);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => UpdateFacilityResponse)
  async updateFacility(@Args('updateFacilityInput', {nullable: true}) updateFacilityInput: UpdateFacilityInput,
                 @Args('photo', { type: () => GraphQLUpload, nullable: true })
                     photo: GraphQLUpload.FileUpload,
                 @Context() context: {req: Request}){

    if (!context.req.user.roles.includes('OWNER')) throw new UnauthorizedException("User doesn't own any facility")

    return await this.facilityService.update(updateFacilityInput.id, updateFacilityInput, context.req.user.id, photo);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Boolean)
  async removeFacilityPhotos(
      @Args('photoIds', { type: () => [Number] }) photoIds: number[],
      @Context() context: { req: Request }
  ): Promise<boolean> {
    if (!context.req.user.roles.includes('OWNER')) throw new UnauthorizedException("User doesn't own any facility");

    return await this.facilityService.removeFacilityPhotos(photoIds, context.req.user.id);
  }


  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => [Image])
  async uploadFacilityPhotos( @Args('facilityId') facilityId: number,
               @Args('photos', { type: () => [GraphQLUpload] })
                   photos: GraphQLUpload.FileUpload[],
               @Context() context: {req: Request}){

    if (!context.req.user.roles.includes('OWNER')) throw new UnauthorizedException("User doesn't own any facility")

    return await this.facilityService.uploadFacilityPhotos(facilityId, context.req.user.id, photos);
  }


  @UseGuards(GraphqlAuthCheck)
  @Query(() => FacilitiesResponse)
  async findAll(@Args('facilitiesFilterInput', {nullable: true}) facilitiesFilterInput: FacilitiesFilterInput,
                @Args('paginationArgs', {nullable: true}) paginationArgs: PaginationArgs,
                @Context() context?: {req: Request}) {
    return await this.facilityService.findAll(facilitiesFilterInput, paginationArgs, context?.req?.user?.id);
  }


  //@UseGuards(GraphqlAuthGuard)
  @UseGuards(RolesGuard)
  @Roles('OWNER')
  @Query(() => FacilitiesResponse)
  async findOwnerFacilities(
      @Args('paginationArgs', { nullable: true }) paginationArgs: PaginationArgs,
      @Context() context?: { req: Request }
  ) {
    return await this.facilityService.findOwnerFacilities(paginationArgs, context.req.user.id);
  }

  @UseGuards(GraphqlAuthCheck)
  @Query(() => Facility, { name: 'facility' })
  async findOne(@Args('id', { type: () => Int }) id: number,
          @Context() context?: {req: Request}) {

    return await this.facilityService.findOne(id, context?.req?.user?.id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Facility)
  removeFacility(@Args('id', { type: () => Int },) id: number,
                 @Context() context: {req: Request}) {
    return this.facilityService.remove(id, context.req.user.id);
  }
}
