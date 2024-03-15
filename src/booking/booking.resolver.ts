import {Resolver, Mutation, Args, Context, Query} from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import {Booking, BookingsResponse} from "./booking.types";
import {UseGuards} from "@nestjs/common";
import {GraphqlAuthGuard} from "../auth/graphql-auth.guard";
import {Request} from "express";
import {PaginationArgs} from "../common/pagination/pagination.args";


@Resolver(() => Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}



  @UseGuards(GraphqlAuthGuard)
  @Query(() => BookingsResponse)
  async findAllBookings(
      @Args('paginationArgs', {nullable: true}) paginationArgs: PaginationArgs,
      @Context() context: { req: Request }) {
    const userId = context.req.user.id;

    return this.bookingService.findAllByUserId(userId, paginationArgs);
  }


  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Booking)
  async createBooking(@Args('createBookingInput') createBookingInput: CreateBookingInput,
                @Context() context: {req: Request}) {
    return this.bookingService.create(createBookingInput, context.req.user.id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Booking)
  async updateBooking(@Args('updateBookingInput') updateBookingInput: UpdateBookingInput,
                @Context() context: {req: Request}) {
    return this.bookingService.update(updateBookingInput.id, updateBookingInput, context.req.user.id);
  }


}
