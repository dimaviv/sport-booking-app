import {BadRequestException, Injectable, UnauthorizedException, HttpException, HttpStatus} from '@nestjs/common';
import {PrismaService} from "../prisma.service";
import {ConfigService} from "@nestjs/config";
import {JwtService} from "@nestjs/jwt";
import {MailService} from "../mail/mail.service";
import * as bcrypt from "bcrypt";
import { v4 as uuidv4 } from 'uuid';
import {Request, Response} from 'express'
import {LoginDto, RegisterDto} from "./dto";
import {User} from "../user/user.type";
import {FacebookStrategy} from "./strategies/facebook.stategy";
import {GoogleStrategy} from "./strategies/google.stategy";
import {RolesService} from "../roles/roles.service";
import {UserService} from "../user/user.service";


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

    async validateOAuthUser(
        accessToken: string,
        refreshToken: string,
        profile: any,
        provider: 'google' | 'facebook',
        response: Response,
    ){
        if (provider === 'google') {
            const oauthUser = await this.googleStrategy.validate(accessToken, refreshToken, profile, this.googleAuth);
            if (!oauthUser) throw new UnauthorizedException('Validating error');
            return this.issueTokens(oauthUser, response)

        } else {
            console.log('facebook or else')
        }

        throw new UnauthorizedException('Invalid provider');
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
            throw new HttpException(
                "Email already in use",
                HttpStatus.BAD_REQUEST
            );
        }
        const hashPassword = await bcrypt.hash(registerDto.password, 10);
        const activationLink =  await uuidv4()

        const {role} = await this.roleService.getRoleByValue('USER')

        const user = await this.prisma.user.create({
            data: {
                email: registerDto.email,
                password: hashPassword,
                activationLink,
                avatar:'null',
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

    async refreshToken(req: Request, res: Response){
        const refreshToken = req.cookies['refresh_token']

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

        const payload = { id: user.id, email: user.email, isActivated: user.isActivated, roles: user.roles };
        const accessToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
            expiresIn: '150sec',
        })
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
            expiresIn: '7d',
        })

        response.cookie('access_token', accessToken, {httpOnly:true} )
        response.cookie('refresh_token', refreshToken, {httpOnly:true})
        return { user }
    }

    private async validateUser(loginDto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { email: loginDto.email},
            include: {roles:true}
        });


        const passwordEquals = await bcrypt.compare(
            loginDto.password,
            user.password
        );
        if (user && passwordEquals) {
            return user;
        }
        throw new UnauthorizedException({ message: "Incorrect email or password" });
    }
}
