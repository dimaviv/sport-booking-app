import {ObjectType, Field, Int, Float} from '@nestjs/graphql';
import {User} from "../user/user.type";
import {Rating} from "../rating/rating.type";
import {Booking, BookingSlot} from "../booking/booking.types";


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

  @Field({nullable: true})
  avgPrice?: number;

  @Field()
  ownerId: number;

  @Field(() => User)
  owner: User;

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
export class FacilitiesResponse {
  @Field(() => [Facility])
  facilities: Facility[];

  @Field()
  totalCount: number;
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

