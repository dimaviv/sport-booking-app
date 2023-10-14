import { ObjectType, Field, Int } from '@nestjs/graphql';
import {sport_type, covering_type, facility_type } from "@prisma/client";
import {User} from "../user/user.type";
import {IsInt} from "class-validator";


@ObjectType()
export class Count {
  @Field()
  ratings: number; // You can adjust the type according to your specific needs
}

@ObjectType()
export class Facility {
  @IsInt()
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

  @Field(() => [Rating], {nullable: true})
  ratings?: Rating[];

  @Field(() => Count, { nullable: true })
  _count?: Count;

  @Field({ nullable: true })
  ratingCount: number;

  @Field({ nullable: true })
  avgRating: number;
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
export class Rating {
  @Field()
  id?: number;

  @Field()
  value: string;

  @Field()
  userId: number;

  @Field(() => User)
  user: User;

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
