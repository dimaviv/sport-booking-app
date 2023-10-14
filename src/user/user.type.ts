import { ObjectType, Field } from '@nestjs/graphql';
import {Role} from "../roles/role.type";
import {Facility} from "../facility/facility.types";

@ObjectType()
export class UserOwner {
    @Field({nullable: true})
    id?: number;

    @Field({nullable: true})
    phone: string;

    @Field({nullable: true})
    organizationName: string;

    @Field({nullable: true})
    userId?: string;
}

@ObjectType()
export class User {
    @Field({nullable: true})
    id?: number;

    @Field({nullable: true})
    fullname: string;

    @Field({nullable: true})
    email: string;

    @Field({nullable: true})
    password?: string;

    @Field({nullable: true})
    dateOfBirth: Date;

    @Field(() => [Role])
    roles?: Role[];

    @Field({nullable: true})
    avatar: string;

    @Field({nullable: true})
    createdAt: Date;

    @Field({nullable: true})
    updatedAt: Date;

    @Field({nullable: true})
    activationLink?: string;

    @Field({nullable: true})
    isActivated: boolean;

    @Field({nullable: true})
    googleId?: string;

    @Field({nullable: true})
    facebookId?: string;


    @Field(() => [Facility], {nullable: true})
    facilities?: Facility[];

    @Field(() => UserOwner, {nullable: true})
    userOwner?: UserOwner;

    // @Field(() => [Booking])
    // bookings: Booking[];
}


