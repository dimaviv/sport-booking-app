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


}
