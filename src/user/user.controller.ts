import {Controller, Get, Query, Res, HttpStatus, Req, Next} from '@nestjs/common';
import { Response, Request } from 'express';
import { UserService } from './user.service';
import * as path from "path";
const deeplink = require('node-deeplink');

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('verify-email')
    async verifyEmail(
        @Query('token') token: string,
        @Next() next,
        @Req() req: Request,
        @Res() res: Response
    ) {
        try {
            //const result = await this.userService.verifyEmailToken(token);
            const result = true;
            const userAgent = req.headers['user-agent'];
            console.log(userAgent)

            if (result) {
                if (this.isMobileDevice(userAgent)) {

                    console.log(`${process.env.APP_URL}/mobile-app-download`)
                    console.log(process.env.ANDROID_PACKAGE_NAME)
                    console.log(process.env.IOS_STORE_LINK)

                    const dp = deeplink({
                        fallback: `${process.env.APP_URL}/mobile-app-download`,
                        android_package_name: `${process.env.ANDROID_PACKAGE_NAME}`,
                        ios_store_link: `${process.env.IOS_STORE_LINK}`,
                        // delay: 1000,
                        // callback: null,
                    })(req, res, next);
                    return dp
                } else {
                    return res.redirect(`${process.env.APP_URL}/email-verification-success`);
                }
            } else {
               // return res.redirect(`${process.env.APP_URL}/email-verification-error`);
                res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid or expired token.' });
            }
        } catch (error) {
            console.log(error)
            // return res.redirect(`${process.env.APP_URL}/email-verification-error`);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error.', error });
        }
    }



    private isMobileDevice(userAgent: string): boolean {
        const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
        return mobileRegex.test(userAgent);
    }
}
