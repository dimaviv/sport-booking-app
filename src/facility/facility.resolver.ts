import {Resolver, Query, Mutation, Args, Int, Context} from '@nestjs/graphql';
import { FacilityService } from './facility.service';
import { CreateFacilityInput } from './dto/create-facility.input';
import { UpdateFacilityInput } from './dto/update-facility.input';
import {Facility, FacilitiesResponse} from "./facility.types";
import {UseGuards} from "@nestjs/common";
import {GraphqlAuthGuard} from "../auth/graphql-auth.guard";
import {Request} from "express";
import {UnauthorizedException} from "../../exceptions/validation.exception";
import {FacilitiesFilterInput} from "./dto/facilities-filter.input";
import {PaginationArgs} from "../common/pagination/pagination.args";
import {GraphqlAuthCheck} from "../auth/graphql-auth-check.guard";

@Resolver(() => Facility)
export class FacilityResolver {
  constructor(private readonly facilityService: FacilityService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Facility)
  async createFacility(@Args('createFacilityInput') createFacilityInput: CreateFacilityInput,
                 @Context() context: {req: Request}) {

    if (!context.req.user.roles.includes('OWNER')) throw new UnauthorizedException("User doesn't own any facility")

    return this.facilityService.create(createFacilityInput, context.req.user.id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Facility)
  async updateFacility(@Args('updateFacilityInput') updateFacilityInput: UpdateFacilityInput,
                 @Context() context: {req: Request}){
    return await this.facilityService.update(updateFacilityInput.id, updateFacilityInput, context.req.user.id);
  }


  @UseGuards(GraphqlAuthCheck)
  @Query(() => FacilitiesResponse)
  async findAll(@Args('facilitiesFilterInput', {nullable: true}) facilitiesFilterInput: FacilitiesFilterInput,
                @Args('paginationArgs', {nullable: true}) paginationArgs: PaginationArgs,
                @Context() context?: {req: Request}) {
    return await this.facilityService.findAll(facilitiesFilterInput, paginationArgs, context?.req?.user?.id);
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
