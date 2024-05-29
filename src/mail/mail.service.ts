import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASSWORD
            }
        })
    }

    async sendActivationMail(email: string, verificationLink: string): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Email Verification',
            html: `<p>Please click the following link to verify your email: <a href="${verificationLink}">${verificationLink}</a></p>`,
        };

        await this.transporter.sendMail(mailOptions);
    }

    async sendRestorePasswordMail(email: string, restoreLink: string): Promise<void> {
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: email,
            subject: 'Password Reset Request',
            html: `<p>Please click the following link to reset your password: <a href="${restoreLink}">${restoreLink}</a></p>`,
        };

        await this.transporter.sendMail(mailOptions);
    }

}
