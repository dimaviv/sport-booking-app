import {Resolver, Mutation, Args, Context} from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import {Booking} from "./booking.types";
import {UseGuards} from "@nestjs/common";
import {GraphqlAuthGuard} from "../auth/graphql-auth.guard";
import {Request} from "express";


@Resolver(() => Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Booking)
  createBooking(@Args('createBookingInput') createBookingInput: CreateBookingInput,
                @Context() context: {req: Request}) {
    return this.bookingService.create(createBookingInput, context.req.user.id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Booking)
  updateBooking(@Args('updateBookingInput') updateBookingInput: UpdateBookingInput,
                @Context() context: {req: Request}) {
    return this.bookingService.update(updateBookingInput.id, updateBookingInput, context.req.user.id);
  }

  // @UseGuards(GraphqlAuthGuard)
  // @Query(() => [Booking], { name: 'booking' })
  // findAll(@Context() context: {req: Request}) {
  //   return this.bookingService.findAll();
  // }
  //
  // @UseGuards(GraphqlAuthGuard)
  // @Query(() => Booking, { name: 'booking' })
  // findOne(@Args('id', { type: () => Int }) id: number,
  //         @Context() context: {req: Request}) {
  //   return this.bookingService.findOne(id);
  // }



  //  User
  // @UseGuards(GraphqlAuthGuard)
  // @Mutation(() => Booking)
  // cancelBooking(@Args('id', { type: () => Int }) id: number) {
  //   return this.bookingService.remove(id);
  // }
}
