import {Field, ObjectType} from "@nestjs/graphql";
import {User} from "../user/user.type";

@ObjectType()
export class RegisterResponse{
    @Field(() => User, {nullable:true})
    user?: User;

    @Field({nullable:true})
    accessToken: string

    @Field({nullable:true})
    refreshToken: string

}

@ObjectType()
export class LoginResponse{
    @Field(() => User)
    user: User;

    @Field()
    accessToken: string

    @Field()
    refreshToken: string
}