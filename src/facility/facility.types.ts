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

  @Field(() => [TimeSlot])
  timeSlots: TimeSlot[];

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
  @Field(() => Number)
  min: number;

  @Field(() => Number)
  max: number;
}

@ObjectType()
export class FacilitiesResponse {
  @Field(() => [Facility])
  facilities: Facility[];

  @Field()
  totalCount: number;

  @Field()
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

