import {Resolver, Query, Mutation, Args, Int, Context} from '@nestjs/graphql';
import { RatingService } from './rating.service';
import { Rating } from './rating.type';
import { CreateRatingInput } from './dto/create-rating.input';
import { UpdateRatingInput } from './dto/update-rating.input';
import {Request} from "express";
import {UseGuards} from "@nestjs/common";
import {GraphqlAuthGuard} from "../auth/graphql-auth.guard";

@Resolver(() => Rating)
export class RatingResolver {
  constructor(private readonly ratingService: RatingService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Rating)
  createRating(@Args('createRatingInput') createRatingInput: CreateRatingInput,
               @Context() context: {req: Request}) {
    return this.ratingService.create(createRatingInput, context.req.user.id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Rating)
  updateRating(@Args('updateRatingInput') updateRatingInput: UpdateRatingInput,
               @Context() context: {req: Request}) {
    return this.ratingService.update(updateRatingInput, context.req.user.id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Rating)
  removeRating(@Args('facilityId', { type: () => Int }) facilityId: number,
               @Context() context: {req: Request}) {
    return this.ratingService.remove(facilityId, context.req.user.id);
  }
}
