import {InputType, Field, Int} from '@nestjs/graphql';
import {IsInt, IsNumber, IsOptional, IsString} from "class-validator";
import {covering_type, sport_type} from "@prisma/client";
import {District} from "../facility.types";

@InputType()
export class FacilitiesFilterInput {

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  readonly sortBy?: string;

  @IsOptional()
  @Field(() => [sport_type], {nullable: true})
  readonly sportType: sport_type[];
  // @Field(() => [String], { nullable: true })
  // readonly sportType?: string[];


  @IsOptional()
  @Field(() => [covering_type], {nullable: true})
  readonly coveringType: covering_type[];

  // @IsOptional()
  // @IsString()
  // @Field({ nullable: true })
  // readonly coveringType?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  readonly facilityType?: string;


  @IsOptional()
  @IsNumber({},{each: true})
  @Field(() => [Int], {nullable: true})
  readonly districts?: number[];

  @IsOptional()
  @IsInt()
  @Field({ nullable: true })
  readonly ownerId?: number;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  readonly search?: string;

}
