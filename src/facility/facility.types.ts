import { ObjectType, Field } from '@nestjs/graphql';
import {User} from "../user/user.type";
import {IsInt} from "class-validator";
import {Rating} from "../rating/rating.type";


@ObjectType()
export class Count {
  @Field()
  ratings: number;
}

@ObjectType()
export class Facility {
  @Field()
  id: number;

  @Field()
  name?: string;

  @Field()
  district: string;

  @Field()
  address: string;

  @Field()
  sportType?: string;

  @Field()
  coveringType?: string;

  @Field()
  facilityType?: string;

  @Field({nullable: true})
  description?: string;

  @Field({nullable: true})
  location?: string;

  @Field({nullable: true})
  minBookingTime?: number;

  @Field()
  ownerId: number;

  @Field(() => User)
  owner: User;

  @Field(() => [Schedule], {nullable: true})
  schedules?: Schedule[];

  @Field(() => [Image], {nullable: true})
  images?: Image[];

  @Field(() => [Rating], )
  ratings?: Rating[];

  @Field(() => Count, )
  _count?: Count;

  @Field()
  ratingCount: number;

  @Field()
  avgRating: number;

  @Field(() => Rating, {nullable: true})
  currentUserRate: Rating;
}

@ObjectType()
export class FacilitiesResponse {
  @Field(() => [Facility])
  facilities: Facility[];

  @Field()
  totalCount: number;
}

@ObjectType()
export class Image {
  @Field()
  id?: number;

  @Field()
  image: string;

  @Field()
  facilityId: number;

  @Field(() => Facility)
  facility: Facility;

}

@ObjectType()
export class Schedule {
  @Field()
  id?: number;

  @Field()
  facilityId: number;

  @Field()
  dayOfWeek: number;

  @Field()
  name: string;

  @Field()
  pricePerHour: number;

  @Field(() => Facility)
  facility: Facility;

  @Field(() => [Slot])
  slots: Slot[];

  @Field(() => [BlockedSlot])
  blockedSlots: BlockedSlot[];
}

@ObjectType()
export class Slot {
  @Field()
  id?: number;

  @Field()
  scheduleId: number;

  @Field()
  startTime: Date;

  @Field()
  endTime: Date;

  @Field(() => Schedule)
  schedule: Schedule;

  // @Field(() => [BookingSlot])
  // bookingSlots: BookingSlot[];
}

@ObjectType()
export class BlockedSlot {
  @Field()
  id?: number;

  @Field(() => Schedule)
  schedule: Schedule;

  @Field()
  scheduleId: number;

  @Field()
  startTime: Date;

  @Field()
  endTime: Date;

  @Field()
  reason: string;

  @Field()
  isRecurring: boolean;
}
