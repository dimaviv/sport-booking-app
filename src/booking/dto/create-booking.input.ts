import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateBookingInput {
  @Field(() => Int, { description: 'Example field (placeholder)' })
  exampleField: number;
}
