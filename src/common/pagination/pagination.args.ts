import { Field, InputType, Int } from "@nestjs/graphql";
import {IsInt} from "class-validator";

@InputType()
export class PaginationArgs {

    @IsInt()
    @Field(() => Int)
    page?: number;

    @IsInt()
    @Field(() => Int)
    limit?: number;
}