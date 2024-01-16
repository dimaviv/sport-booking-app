import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { BookingService } from './booking.service';
import { CreateBookingInput } from './dto/create-booking.input';
import { UpdateBookingInput } from './dto/update-booking.input';
import {Booking} from "./booking.types";
import {UseGuards} from "@nestjs/common";
import {GraphqlAuthGuard} from "../auth/graphql-auth.guard";

@Resolver(() => Booking)
export class BookingResolver {
  constructor(private readonly bookingService: BookingService) {}

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Booking)
  createBooking(@Args('createBookingInput') createBookingInput: CreateBookingInput) {
    return this.bookingService.create(createBookingInput);
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => [Booking], { name: 'booking' })
  findAll() {
    return this.bookingService.findAll();
  }

  @UseGuards(GraphqlAuthGuard)
  @Query(() => Booking, { name: 'booking' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.bookingService.findOne(id);
  }

  @Mutation(() => Booking)
  updateBooking(@Args('updateBookingInput') updateBookingInput: UpdateBookingInput) {
    return this.bookingService.update(updateBookingInput.id, updateBookingInput);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation(() => Booking)
  removeBooking(@Args('id', { type: () => Int }) id: number) {
    return this.bookingService.remove(id);
  }
}
