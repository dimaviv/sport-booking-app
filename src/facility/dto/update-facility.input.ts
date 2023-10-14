import { CreateFacilityInput } from './create-facility.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import {IsInt, isNumber} from "class-validator";

@InputType()
export class UpdateFacilityInput extends PartialType(CreateFacilityInput) {

  @Field()
  @IsInt()
  readonly id: number;
}
