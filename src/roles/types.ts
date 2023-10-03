import {Field, ObjectType} from "@nestjs/graphql";
import {Role} from "./role.type";

@ObjectType()
export class RoleResponse{
    @Field(() => Role)
    role: Role;
}