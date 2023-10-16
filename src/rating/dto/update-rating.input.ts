import { InputType, Field, Int } from '@nestjs/graphql';
import {IsInt} from "class-validator";

@InputType()
export class UpdateRatingInput {
  @IsInt()
  @Field(() => Int)
  id: number;

  @IsInt()
  @Field()
  value: number;
}
