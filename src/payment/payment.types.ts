import {Field, Float, Int, ObjectType} from "@nestjs/graphql";
import {Booking} from "../booking/booking.types";




@ObjectType()
export class Payment {
    @Field(() => Int)
    id: number;

    @Field(() => Float)
    amount: number;

    @Field()
    currency: string;

    @Field(() => Int)
    bookingId: number;

    @Field(() => Booking)
    booking: Booking;

    @Field()
    status: string;

    @Field()
    orderId: string;

    @Field(() => Float, { nullable: true })
    transactionId?: number;

    @Field()
    createdAt: Date;

    @Field()
    updatedAt: Date;
}
