import { Controller, Get, Query, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get('verify-email')
    async verifyEmail(
        @Query('token') token: string,
        @Res() res: Response
    ) {
        try {
            const result = await this.userService.verifyEmailToken(token);

            if (result) {
                return res.redirect(`${process.env.APP_URL}/email-verification-success`);
            } else {
                res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid or expired token.' });
            }
        } catch (error) {
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Server error.', error });
        }
    }
}
