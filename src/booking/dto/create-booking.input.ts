import {Field, InputType, Int} from "@nestjs/graphql";
import {IsInt, IsNotEmpty, IsNumber} from "class-validator";

@InputType()
export class CreateBookingInput {

  @IsInt()
  @Field(() => Int)
  facilityId: number;

  @IsNotEmpty()
  @IsNumber({},{each: true})
  @Field(() => [Int])
  timeSlotIds: number[];
}