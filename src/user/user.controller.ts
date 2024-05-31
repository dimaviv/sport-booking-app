import {Controller, Get, Query, Res, HttpStatus, Req, Next, Param} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';


@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('restore-password')
    async restorePassword(
        @Query('token') token: string,
        @Next() next,
        @Req() req: Request,
        @Res() res: Response
    ) {
        try {
            const userAgent = req.headers['user-agent'];
            console.log(userAgent)

            if (this.isMobileDevice(userAgent)) {
                const deepLinkUrl = `${process.env.MIBILE_APP_SCHEMA}://link/restore-password?token=${token}`;
                console.log(deepLinkUrl)
                res.redirect(deepLinkUrl);
            }
            return res.redirect(`${process.env.APP_URL}/restore-password?token=${token}`);

        } catch (error) {
            console.log(error)
            return res.redirect(`${process.env.APP_URL}/restore-password?token=${token}`);
        }
    }

    @Get('verify-email')
    async verifyEmail(
        @Query('token') token: string,
        @Next() next,
        @Req() req: Request,
        @Res() res: Response
    ) {
        try {
            const result = await this.userService.verifyEmailToken(token);
            const userAgent = req.headers['user-agent'];
            console.log(userAgent)

            if (result) {
                if (this.isMobileDevice(userAgent)) {
                    const deepLinkUrl = `${process.env.MIBILE_APP_SCHEMA}://link/email-confirmation`;
                    console.log(deepLinkUrl)
                    res.redirect(deepLinkUrl);
                }
                return res.redirect(`${process.env.APP_URL}/email-verification-success`);
            }

            return res.redirect(`${process.env.APP_URL}/email-verification-error`);
            //res.status(HttpStatus.BAD_REQUEST).json({message: 'Invalid or expired token.'});

        } catch (error) {
            console.log(error)
            return res.redirect(`${process.env.APP_URL}/email-verification-error`);
            //res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error.', error });
        }
    }

    private isMobileDevice(userAgent: string): boolean {
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return mobileRegex.test(userAgent);
    }
}
