import {Resolver, Mutation, Args} from '@nestjs/graphql';
import { PaymentService } from './payment.service';
import { CreatePaymentInput } from './dto/create-payment.input';
import {Payment} from "./payment.types";


@Resolver()
export class PaymentResolver {
  constructor(private readonly paymentService: PaymentService) {}

  @Mutation(() => Payment)
  async createPayment(
      @Args('createPaymentInput') createPaymentInput: CreatePaymentInput
  ) {
    return this.paymentService.createPayment(createPaymentInput);
  }


}
