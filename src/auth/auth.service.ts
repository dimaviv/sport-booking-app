import {BadRequestException, Injectable, UnauthorizedException, HttpException, HttpStatus} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {MailService} from "../mail/mail.service";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import {Request, response, Response} from 'express'
import {LoginDto, RegisterDto} from "./dto";
import {User} from "../user/user.type";
import {FacebookStrategy} from "./strategies/facebook.stategy";
import {GoogleStrategy} from "./strategies/google.stategy";
import {RolesService} from "../roles/roles.service";
import {UserService} from "../user/user.service";
import {GraphQLError} from "graphql/index";
import {before} from "@nestjs/graphql/dist/plugin";


@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly prisma: PrismaService,
        private readonly configService: ConfigService,
        private readonly mailService: MailService,
        private readonly roleService: RolesService,
        private readonly googleStrategy: GoogleStrategy,
        private readonly facebookStrategy: FacebookStrategy,
        private readonly userService: UserService,
        ) {
    }


    async googleAuth(req, res){
        if (!req.user) {
            return 'No user from google'
        }
        let existUser = await this.userService.findByOAuthId(req.user.googleId)

        if (!existUser){
           const newUser = await this.userService.createUserFromOAuthData(req.user);
           return this.issueTokens(newUser, res);
        }
        return this.issueTokens(existUser, res);
    }


    async authWithGoogle(token, response){
       const googleUser = await this.fetchGoogleUserProfile(token)
      // const googleUser = {profile: {googleId: '12312', fullname:'Максим Глущук', email: 'test@gmail.com'},
      //     googleId: '12312', email: 'test@gmail.com'};
      const existUser = await this.prisma.user.findUnique({
          where: {email:googleUser.email, googleId: googleUser.googleId},
          include: {roles:true}});

        console.log('googleUser', googleUser)
        console.log('existUser', existUser)
      if (!existUser){
        const newUser = await this.userService.createUserFromOAuthData(googleUser.profile);
        return this.issueTokens(newUser, response);
      }

      return this.issueTokens(existUser, response);
    }

    async fetchGoogleUserProfile(accessToken) {
        const googleUserInfoUrl = 'https://www.googleapis.com/oauth2/v2/userinfo';
        console.log(accessToken)
        try {
            const response = await fetch(googleUserInfoUrl, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            console.log(response)
            if (!response.ok) {
                throw new Error('Failed to fetch user profile from Google');
            }

            const data = await response.json();
            console.log(response)
            return {profile: data, googleId: data.id, email: data.email};
        } catch (error) {
            console.error('Error fetching Google user info:', error);
            throw new Error('Error validating Google accessToken');
        }
    }

    async facebookAuth(req, res){
        if (!req.user) {
            return 'No user from facebook'
        }
        console.log(req.user)
        let existUser = await this.userService.findByOAuthId(req.user.facebookId)

        if (!existUser){
            const newUser = await this.userService.createUserFromOAuthData(req.user);
            console.log("New: ", newUser)
            return this.issueTokens(newUser, res);
        }
        console.log("existedUser: ", existUser)
        return this.issueTokens(existUser, res);
    }

    async login(loginDto: LoginDto, response: Response) {
        const user = await this.validateUser(loginDto);

        if (!user){
            throw new HttpException(
                "Incorrect email or password",
                HttpStatus.BAD_REQUEST
            );
        }
        return this.issueTokens(user, response);
    }

    async logout(response: Response){
        response.clearCookie('access_token');
        response.clearCookie('refresh_token');
        return 'Successfully logged out';
    }

    async registration(registerDto: RegisterDto, response: Response) {
        const candidate = await this.prisma.user.findUnique({
            where: {email: registerDto.email}
        });
        if (candidate) {
            throw new BadRequestException("Email already in use");
        }
        const hashPassword = await bcrypt.hash(registerDto.password, 10);
        const activationLink =  await uuidv4()

        const {role} = await this.roleService.getRoleByValue('USER')

        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                password: hashPassword,
                activationLink,
                avatar: null,
                roles: {
                    connect:{
                        id: role.id
                    }
                }
            },
            include: {
                roles: true,
            },
        });

        const activationURL = process.env.API_URL+'users/activate/' + activationLink
        await this.mailService.sendActivationMail(user.email, activationURL)

        return this.issueTokens(user, response);
    }

    async refreshToken(req: Request, res: Response, refresh = null){
        const refreshToken = req.cookies['refresh_token'] ?? refresh

        if (!refreshToken){
            throw new UnauthorizedException("Refresh token not found")
        }
        let payload;
        try {
            payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get<string>('REFRESH_TOKEN_SECRET')
            })
        }catch (error){
            throw new UnauthorizedException('Invalid or expired refresh token')
        }
        const userExists = await this.prisma.user.findUnique({
            where: {id: payload.id},
        })
        if (!userExists){
            throw new BadRequestException('User no longer exists')
        }

        const expiredIn = 15000;
        const expiration = Math.floor(Date.now() / 1000) + expiredIn;
        const accessToken = this.jwtService.sign(
            {...payload, exp:expiration},
            {
                secret: this.configService.get<string>('ACCESS_TOKEN_SECRET')
            }
        );
        res.cookie('access_token', accessToken, {httpOnly: true});

        return accessToken;
    }

    private async issueTokens(user: User, response: Response) {
        const payload = { id: user.id, email: user.email, isActivated: user.isActivated, roles: user.roles.map(role => role.value) };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            expiresIn: '1d',
        })
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
            expiresIn: '7d',
        })

        response.cookie('access_token', accessToken, {httpOnly:true} )
        response.cookie('refresh_token', refreshToken, {httpOnly:true})
        return { user, accessToken, refreshToken }
    }

    private async validateUser(loginDto: LoginDto) {

        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email},
            include: {roles:true}
        });

       if (!user) throw new BadRequestException("Incorrect email or password");

        const passwordEquals = await bcrypt.compare(
            loginDto.password,
            user.password
        );
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException( "Incorrect email or password");
    }
}
