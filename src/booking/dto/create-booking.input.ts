import {Field, InputType, Int} from "@nestjs/graphql";
import {IsInt, IsNotEmpty, IsNumber, IsOptional} from "class-validator";

@InputType()
export class CreateBookingInput {

  @IsInt()
  @Field(() => Int)
  facilityId: number;

  @IsNotEmpty()
  @IsNumber({},{each: true})
  @Field(() => [Int])
  timeSlotIds: number[];

  @IsOptional()
  @Field({ nullable: true })
  includesInventory?: boolean;
}
