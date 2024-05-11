import { CreateFacilityInput } from './create-facility.input';
import { InputType, Field, PartialType } from '@nestjs/graphql';
import {IsBoolean, IsInt, isNumber, IsString} from "class-validator";
import {covering_type, facility_type, sport_type} from "@prisma/client";

@InputType()
export class UpdateFacilityInput{

  @Field()
  @IsInt()
  readonly id: number;

  @IsString({message: "Must be string"})
  @Field()
  readonly name: string;

  @IsString({message: "Must be string"})
  @Field()
  readonly address: string;

  @IsString({message: "Must be string"})
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

  @IsInt({ message: 'Must be int' })
  @Field({ nullable: true })
  readonly minBookingTime?: number;

  @IsBoolean()
  @Field({ nullable: true })
  readonly isWorking: boolean;
}
