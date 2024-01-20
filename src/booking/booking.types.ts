import {ObjectType, Field, Int, Float} from '@nestjs/graphql';
import {Facility, TimeSlot} from "../facility/facility.types";
import {User} from "../user/user.type";



@ObjectType()
export class Booking {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  userId: number;

  @Field(() => Int)
  facilityId: number;

  @Field({ nullable: true })
  status?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field(() => [BookingSlot])
  bookingSlots: BookingSlot[];

  @Field(() => User)
  user: User;

  @Field(() => Facility)
  facility: Facility;

}

@ObjectType()
export class BookingSlot {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  bookingId: number;

  @Field(() => Int)
  timeSlotId: number;

  @Field(() => Booking)
  booking: Booking;

  @Field(() => TimeSlot)
  timeSlot: TimeSlot;
}




