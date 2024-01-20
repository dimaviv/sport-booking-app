import { CreateBookingInput } from './create-booking.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import {IsInt} from "class-validator";

@InputType()
export class UpdateBookingInput extends PartialType(CreateBookingInput) {

  @IsInt()
  @Field(() => Int)
  id: number;
}
