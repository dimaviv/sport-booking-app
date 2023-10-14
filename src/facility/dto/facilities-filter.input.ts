import { InputType, Field, PartialType } from '@nestjs/graphql';
import {IsInt, isNumber, IsOptional, IsString} from "class-validator";

@InputType()
export class FacilitiesFilterInput {

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  readonly sortBy?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  readonly sportType?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  readonly coveringType?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  readonly facilityType?: string;

  @IsOptional()
  @IsString()
  @Field({ nullable: true })
  readonly district?: string;

  @IsOptional()
  @IsInt()
  @Field({ nullable: true })
  readonly ownerId?: number;

}
