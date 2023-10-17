import {Controller, Get, UseGuards, Req, Res} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Get('/google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {

        const user = await this.authService.googleAuth(req, res)
        res.redirect(process.env.APP_URL)
        return user
    }

    @Get('/facebook/callback')
    @UseGuards(AuthGuard('facebook'))
    async facebookAuthRedirect(@Req() req, @Res() res) {

        const user = await this.authService.facebookAuth(req, res)
        res.redirect(process.env.APP_URL)
        return user
    }
}