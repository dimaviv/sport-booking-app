import { ObjectType, Field } from '@nestjs/graphql';


@ObjectType()
export class Facility {
    @Field({nullable: true})
    id?: number;

    @Field({nullable: true})
    userId: number;

    @Field()
    facilityId: number;

    @Field({nullable: true})
    startTime: Date;

    @Field({nullable: true})
    endTime: Date;

    @Field({nullable: true})
    createdAt: Date;

    @Field({nullable: true})
    updatedAt: Date;



    // @Field(() => [Facility])
    // facilities: Facility[];

    // @Field(() => [Booking])
    // bookings: Booking[];
}
