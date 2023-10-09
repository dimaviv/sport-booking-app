import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";
import {Field, InputType} from "@nestjs/graphql";
import { GraphQLJSONObject } from 'graphql-type-json';


@InputType()
export class OAuthDto {
    @Field()
    accessToken: string;

    @Field()
    refreshToken: string;

    @Field(() => GraphQLJSONObject)
    profile: object

    @Field()
    provider: 'google' | 'facebook';
}


@InputType()
export class RegisterDto {
    @Field()
    @IsNotEmpty( {message: 'Email is required'})
    @IsString({message: "Must be string"})
    @IsEmail({}, {message: 'Incorrect email address'})
    readonly email:string;

    @Field()
    @IsNotEmpty( {message: 'Password is required'})
    @IsString({message: "Must be string"})
    @Length(6, 16, {message:"Must contain 6 - 16 symbols"})
    readonly password:string;

    @Field()
    @IsNotEmpty( {message: 'Confirm Password is required'})
    @IsString({message: "Must be string"})
    @Length(6, 16, {message:"Must contain 6 - 16 symbols"})
    readonly confirmPassword:string;
}


@InputType()
export class LoginDto {

    @Field()
    @IsNotEmpty( {message: 'Email is required'})
    @IsString({message: "Must be string"})
    @IsEmail({}, {message: 'Incorrect email address'})
    readonly email:string;

    @Field()
    @IsNotEmpty( {message: 'Password is required'})
    @IsString({message: "Must be string"})
    @Length(6, 16, {message:"Must contain 6 - 16 symbols"})
    readonly password:string;
}



