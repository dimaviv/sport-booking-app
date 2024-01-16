import { ObjectType, Field, Int } from '@nestjs/graphql';
import {Facility, Slot} from "../facility/facility.types";
import {User} from "../user/user.type";

@ObjectType()
export class Booking {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => String)
  status: string;

  @Field(() => User)
  user: User;

  @Field(() => [BookingSlot])
  bookingSlots: BookingSlot[];

  @Field(() => Facility, { nullable: true })
  facility: Facility;

  @Field(() => Int, { nullable: true })
  facilityId: number;
}

@ObjectType()
export class BookingSlot {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  bookingId: number;

  @Field(() => Int)
  slotId: number;

  @Field(() => Booking)
  booking: Booking;

  @Field(() => Slot)
  slot: Slot;
}
