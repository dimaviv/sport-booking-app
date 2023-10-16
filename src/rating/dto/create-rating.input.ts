import { InputType, Field } from '@nestjs/graphql';
import {IsInt} from "class-validator";

@InputType()
export class CreateRatingInput {
  @IsInt()
  @Field()
  value: number;

  @IsInt()
  @Field()
  facilityId: number;
}
