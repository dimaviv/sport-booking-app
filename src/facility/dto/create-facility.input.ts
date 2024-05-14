import {InputType, Field, registerEnumType} from '@nestjs/graphql';
import {covering_type, facility_type, sport_type} from "@prisma/client";
import {IsArray, IsEnum, IsInt, IsOptional, IsString} from "class-validator";

@InputType()
export class CreateFacilityInput {

  @IsString({message: "Name must be a string"})
  @Field()
  readonly name: string;

  @IsInt({ message: 'District ID must be an integer' })
  @Field()
  readonly districtId: number;

  @IsString({message: "Address must be a string"})
  @Field()
  readonly address: string;

  @IsArray({ message: 'Sport types must be an array' })
  @IsEnum(sport_type, { each: true, message: 'Each sport type must be a valid enum value' })
  @Field(() => [sport_type])
  readonly sportType: sport_type[];

  @IsString({message: "Covering type must be a string"})
  @Field(() => covering_type)
  readonly coveringType: covering_type;

  @IsString({message: "Facility type must be a string"})
  @Field(() => facility_type)
  readonly facilityType: facility_type;

  @IsString({message: "Description must be a string"})
  @Field({ nullable: true })
  readonly description?: string;

  @IsString({message: "Location must be a string"})
  @Field({ nullable: true })
  readonly location?: string;

  @IsOptional()
  @IsInt({ message: 'Minimum booking time must be an integer'})
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
