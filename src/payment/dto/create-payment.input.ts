import { InputType, Int, Field, Float } from '@nestjs/graphql';
import {IsNumber, IsString} from "class-validator";

@InputType()
export class CreatePaymentInput {

  @IsNumber()
  @Field(() => Int, { description: 'ID of the booking' })
  bookingId: number;

  @IsNumber()
  @Field(() => Float, { description: 'Amount of money to be paid' })
  amount: number;

  @IsString({message: "Must be string"})
  @Field(() => String, { description: 'Order ID from LiqPay' })
  orderId: string;
}
