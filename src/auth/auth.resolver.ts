import {Args, Context, Mutation, Query, Resolver} from '@nestjs/graphql';
import {AuthService} from "./auth.service";
import {LoginResponse, RegisterResponse} from "./types";
import {LoginDto, RegisterDto} from "./dto";
import {BadRequestException, UnauthorizedException} from "@nestjs/common";
import {Response, Request} from "express";
import {GraphQLError} from "graphql/index";


@Resolver()
export class AuthResolver {
    constructor(
        private readonly authService: AuthService,
    ) {}


    @Mutation(() => LoginResponse)
    async googleAuth(@Args('token') token: string,
                     @Context() context: { req: Request, res: Response }) {

        return this.authService.authWithGoogle(token, context.req.res);
    }

    @Mutation(() => RegisterResponse)
    async register(
        @Args('registerInput') registerDto: RegisterDto,
        @Context() context: { req: Request, res: Response }) {

        if (registerDto.password !== registerDto.confirmPassword) {
            throw new BadRequestException(
                'Password and confirm password are not the same'
            )
        }
        return await this.authService.registration(registerDto, context.req.res);
    }

    @Mutation(() => LoginResponse)
    async login(
        @Args('loginInput') loginDto: LoginDto,
        @Context() context: { req: Request, res: Response }) {

        return this.authService.login(loginDto, context.req.res);
    }

    @Mutation(() => String)
    async logout( @Context() context: { req: Request, res: Response }){
        return this.authService.logout(context.req.res)
    }

    @Mutation(() => String, { name: 'accessToken' })
    async refreshToken(
        @Args('refresh', {nullable: true}) refresh: string,
        @Context() context: { req: Request, res: Response }){
        try {
            return this.authService.refreshToken(context.req, context.req.res, refresh);
        }catch (err){
            throw new BadRequestException(err.message);
        }
    }



}