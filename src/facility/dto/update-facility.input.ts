import { InputType, Field } from '@nestjs/graphql';
import {IsArray, IsBoolean, IsEnum, IsInt, IsOptional, IsString} from "class-validator";
import {covering_type, facility_type, sport_type} from "@prisma/client";


@InputType()
export class UpdateFacilityInput {
  @Field()
  @IsInt({ message: 'id must be an integer' })
  readonly id: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'name must be a string' })
  readonly name?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'address must be a string' })
  readonly address?: string;

  @Field(() => [sport_type], { nullable: true })
  @IsOptional()
  @IsArray({ message: 'Sport types must be an array' })
  @IsEnum(sport_type, { each: true, message: 'Each sport type must be a valid enum value' })
  readonly sportType?: sport_type[];

  @Field(() => covering_type, { nullable: true })
  @IsOptional()
  @IsString({ message: 'coveringType must be a string' })
  readonly coveringType?: covering_type;

  @Field(() => facility_type, { nullable: true })
  @IsOptional()
  @IsString({ message: 'facilityType must be a string' })
  readonly facilityType?: facility_type;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'description must be a string' })
  readonly description?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsInt({ message: 'minBookingTime must be an integer' })
  readonly minBookingTime?: number;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'isWorking must be a boolean' })
  readonly isWorking?: boolean;
}
