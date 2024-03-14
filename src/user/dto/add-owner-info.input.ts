import { IsString} from "class-validator";
import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class AddOwnerInfoInput {

    @IsString({message: "Must be a string"})
    @Field()
    readonly phone: string;

    @IsString({message: "Must be a string"})
    @Field()
    readonly organizationName: string;
}