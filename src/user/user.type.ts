import { ObjectType, Field } from '@nestjs/graphql';
import {Role} from "../roles/role.type";


@ObjectType()
export class User {
    @Field({nullable: true})
    id?: number;

    @Field({nullable: true})
    fullname: string;

    @Field()
    email: string;

    @Field({nullable: true})
    password: string;

    @Field({nullable: true})
    dateOfBirth: Date;

    @Field(() => [Role], {nullable: true})
    roles?: Role[];

    @Field({nullable: true})
    avatar: string;

    @Field({nullable: true})
    createdAt: Date;

    @Field({nullable: true})
    updatedAt: Date;

    @Field({nullable: true})
    activationLink: string;

    @Field({nullable: true})
    isActivated: boolean;


    // @Field(() => [Facility])
    // facilities: Facility[];

    // @Field(() => [Booking])
    // bookings: Booking[];
}
