import {IsEmail, IsString, Length} from "class-validator";

export class CreateUserDto {

    @IsString({message: "Must be string"})
    @IsEmail({}, {message: 'Incorrect email address'})
    readonly email:string;

    @IsString({message: "Must be string"})
    @Length(4, 16, {message:"Must contain 4 - 16 symbols"})
    readonly password:string;

}