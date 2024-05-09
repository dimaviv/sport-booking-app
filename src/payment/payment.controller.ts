import {Controller, Post, Body, HttpCode, Get, Req, Res, HttpStatus} from '@nestjs/common';
import {PaymentService} from "./payment.service";
import {Request, Response} from "express";


@Controller('payment')
export class PaymentController {
    constructor(private paymentService: PaymentService) {}

    @Post('callback')
    @HttpCode(200)
    async handlePaymentCallback(@Req() req: Request, @Res() res: Response) {

        const data = req.body.data;
        const signature = req.body.signature;

        console.log('WORKED')
        console.log(data)
        console.log(signature)
        //const test =  this.paymentService.handlePaymentStatus(req.body)
        console.log(test)
        // Here you would add your logic to verify the signature and process the data
        // For example, decode the data and validate the signature

        res.status(HttpStatus.OK).send('OK');
        // const isValid = this.paymentService.verifySignature(callbackData);
        // if (isValid) {
        //     await this.paymentService.processPaymentCallback(callbackData);
        //     return 'ok';
        // } else {
        //
        //     return 'verification failed';
        // }
    }

    // @Get('form')
    // @HttpCode(200)
    //  createPayment(@Body() paymentDto: { amount: number, currency: string, description: string }) {
    //     const res = this.paymentService.createSubscriptionPaymentForm();
    //     console.log(res)
    //     return res
    // }




}
