import {Controller, Get, UseGuards, Req, Res} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport'
import {AuthService} from "./auth.service";

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    // @Get()
    // @UseGuards(AuthGuard('google'))
    // async googleAuth(@Req() req) { }

    @Get('/google/callback')
    @UseGuards(AuthGuard('google'))
    async googleAuthRedirect(@Req() req, @Res() res) {

        const user = await this.authService.googleAuth(req, res)
        res.redirect('/targetPage')
        return user
    }
}