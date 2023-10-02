import {IsDate, IsOptional, IsString, Length, MaxDate, MinDate} from "class-validator";
import {Field, InputType} from "@nestjs/graphql";

@InputType()
export class UpdateUserDto {
    @Field()
    @IsOptional()
    @IsString({message: "Must be string"})
    @Length(6, 20, {message:"Must contain 6 - 20 symbols"})
    readonly fullname?:string;

    @Field()
    @IsOptional()
    @IsDate({ message: 'Invalid date format' })
    @MinDate(new Date('1900-01-01'), { message: 'Date of birth is too early' })
    @MaxDate(new Date(), { message: 'Date of birth is in the future' })
    readonly dateOfBirth?: Date;


}