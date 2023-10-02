import {IsNumber, IsString} from "class-validator";
import {InputType} from "@nestjs/graphql";

@InputType()
export class BanUserDto {

    @IsNumber({},{message:"Must be a number"})
    readonly userId: number;

    @IsString({message: "Must be string"})
    readonly banReason: string;

}