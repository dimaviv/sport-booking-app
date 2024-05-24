import {ObjectType, Field, Int, Float } from '@nestjs/graphql';
import {User} from "../user/user.type";
import {Rating} from "../rating/rating.type";
import {Booking} from "../booking/booking.types";
import {City, District} from "../location/location.types";


@ObjectType()
export class Count {
  @Field()
  ratings: number;
}


@ObjectType()
export class DailySchedule {
  @Field(() => Int)
  dayOfWeek: number;

  @Field(() => Date)
  date: Date;

  @Field(() => [TimeSlot])
  timeSlots: TimeSlot[];
}

@ObjectType()
export class Facility {
  @Field()
  id: number;

  @Field({ nullable: true })
  name?: string;

  @Field()
  address: string;

  @Field(() => [String], { nullable: true })
  sportType?: string[];

  @Field({ nullable: true })
  coveringType?: string;

  @Field({ nullable: true })
  facilityType?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  location?: string;

  @Field({ nullable: true })
  minBookingTime?: number;

  @Field({ nullable: true })
  avgPrice?: number;

  @Field()
  ownerId: number;

  @Field(() => User)
  owner: User;

  @Field(() => District)
  district: District;

  @Field(() => City)
  city: City;

  @Field(() => [Image], { nullable: true })
  images?: Image[];

  @Field(() => [Rating], { nullable: true })
  ratings?: Rating[];

  @Field()
  ratingCount: number;

  @Field()
  avgRating: number;

  @Field(() => Rating, { nullable: true })
  currentUserRate?: Rating;

  @Field(() => Boolean, { nullable: true })
  currentUserIsFavorite?: Boolean;

  @Field(() => Boolean, { nullable: true })
  currentUserIsRated?: Boolean;

  @Field(() => Boolean, { nullable: true })
  userHasRated?: Boolean;

  @Field(() => Boolean, { nullable: true })
  isWorking?: Boolean;

  @Field(() => [TimeSlot], { nullable: true })
  timeSlots?: TimeSlot[];

  @Field(() => [DailySchedule], { nullable: true })
  schedule?: DailySchedule[];

  @Field(() => [Booking])
  bookings: Booking[];

}

@ObjectType()
export class TimeSlot {
  @Field(() => Int)
  id: number;

  @Field(() => Int)
  facilityId: number;

  @Field(() => Int)
  dayOfWeek: number;

  @Field({ nullable: true })
  date?: Date;

  @Field()
  startTime: Date;

  @Field()
  endTime: Date;

  @Field(() => Float)
  price: number;

  @Field()
  status?: string;

  @Field(() => Facility)
  facility: Facility;

  @Field()
  temporaryBlockDate: Date;
}

@ObjectType()
export class Image {
  @Field()
  id?: number;

  @Field()
  image: string;

  @Field()
  facilityId: number;

  @Field({nullable:true})
  isMain: boolean;

  @Field(() => Facility, {nullable: true})
  facility?: Facility;

}

@ObjectType()
export class PriceRange {
  @Field(() => Number, { nullable: true })
  min: number;

  @Field(() => Number, { nullable: true })
  max: number;
}

@ObjectType()
export class FacilitiesResponse {
  @Field(() => [Facility])
  facilities: Facility[];

  @Field()
  totalCount: number;

  @Field({ nullable: true })
  priceRange: PriceRange;
}

@ObjectType()
export class UpdateFacilityResponse {
  @Field(() => Facility)
  facility: Facility;

  @Field(() => Image, {nullable:true})
  photo?: Image
}

@ObjectType()
export class CreateFacilityResponse {
  @Field(() => Facility)
  facility: Facility;

  @Field(() => Image, {nullable:true})
  photo?: Image
}

