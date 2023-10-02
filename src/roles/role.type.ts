import { ObjectType, Field } from '@nestjs/graphql';
import {User} from "../user/user.type";


@ObjectType()
export class Role {
    @Field({nullable: true})
    id?: number;

    @Field({nullable: true})
    value: string;

    @Field({nullable: true})
    description: string;

    @Field(() => [User], {nullable: true})
    users?: User[];

}
