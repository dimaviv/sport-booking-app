import {InputType, Int, Field, registerEnumType} from '@nestjs/graphql';
import {covering_type, facility_type, sport_type} from "@prisma/client";
import {IsDate, IsInt, IsOptional, IsString} from "class-validator";

@InputType()
export class CreateFacilityInput {

  @IsString({message: "Must be string"})
  @Field()
  readonly name: string;

  @IsString({message: "Must be string"})
  @Field()
  readonly districtId: number;

  @IsString({message: "Must be string"})
  @Field()
  readonly address: string;

  // @IsString({message: "Must be string"})
  @Field(() => [sport_type])
  readonly sportType: sport_type[];

  @IsString({message: "Must be string"})
  @Field(() => covering_type)
  readonly coveringType: covering_type;

  @IsString({message: "Must be string"})
  @Field(() => facility_type)
  readonly facilityType: facility_type;

  @IsString({message: "Must be string"})
  @Field({ nullable: true })
  readonly description?: string;

  @IsString({message: "Must be string"})
  @Field({ nullable: true })
  readonly location?: string;

  @IsInt({ message: 'Must be int' })
  @Field({ nullable: true })
  readonly minBookingTime?: number;

}


registerEnumType(sport_type, {
  name: 'sport_type',
});

registerEnumType(covering_type, {
  name: 'covering_type',
});

registerEnumType(facility_type, {
  name: 'facility_type',
});
