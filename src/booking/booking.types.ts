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

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field()
  startTime: Date;

  @Field()
  endTime: Date;

  @Field({ nullable: true })
  includesInventory: Boolean;

}

@ObjectType()
export class BookingsResponse {
  @Field(() => [Booking])
  bookings: Booking[];

  @Field()
  totalCount: number;
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




