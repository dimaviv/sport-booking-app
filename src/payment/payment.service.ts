import {BadRequestException, Injectable} from '@nestjs/common';
import {CreatePaymentInput} from './dto/create-payment.input';
import * as crypto from 'crypto';
import {PrismaService} from "../prisma.service";
import {InternalException} from "../../exceptions/validation.exception";

@Injectable()
export class PaymentService {

    constructor(
        private readonly prisma: PrismaService,
    ) {
    }

    async fetchLiqPayStatus(orderId: string): Promise<any> {
        const LIQPAY_API_URL = 'https://www.liqpay.ua/api/request';
        const jsonString = JSON.stringify({
            action: 'status',
            version: 3,
            public_key: process.env.PUBLIC_LIQPAY_KEY,
            order_id: orderId,
        });
        const encodedData = Buffer.from(jsonString).toString('base64');

        const hash = crypto.createHash('sha1');
        const signature = hash.update(process.env.PRIVAT_LIQPAY_KEY + encodedData + process.env.PRIVAT_LIQPAY_KEY)
            .digest('base64');

        const params = new URLSearchParams();
        params.append('data', encodedData);
        params.append('signature', signature);

        try {
            const response = await fetch(LIQPAY_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: params
            });

            return await response.json();
        } catch (error) {
            console.log('[error]', error);
            throw new Error('Failed to fetch status from LiqPay');
        }
    }

    async verifyLiqPayTransaction(orderId: string): Promise<boolean> {
        try {
            const data = await this.fetchLiqPayStatus(orderId);
            console.log(data);
            return data.result === 'ok';
        } catch (error) {
            console.log('[error]', error);
            return false;
        }
    }

    async createPayment(createPaymentInput: CreatePaymentInput) {
        try {
            const {bookingId, amount, orderId} = createPaymentInput;
            const booking = await this.prisma.booking.findUnique({
                where: {id: bookingId, price: amount}
            });

            if (!booking) {
                throw new Error('Booking does not exist');
            }

            const existingPayments = await this.prisma.payment.findMany({
                where: {
                    bookingId,
                    amount,
                }
            });

            if (existingPayments.some(payment => payment.status === 'success')){
                throw new BadRequestException('Payment for this booking has already been successfully completed.');
            }

            for (const payment of existingPayments) {
                 if (payment.status === 'pending' || payment.status === 'error') {
                    const updatedPayment = await this.prisma.payment.update({
                        where: { id: payment.id },
                        data: { orderId, amount },
                    });
                    this.processPaymentVerification(orderId, payment.id, bookingId, 2000);
                    return updatedPayment;
                }
            }

            const payment = await this.prisma.payment.create({
                data: {
                    bookingId,
                    amount,
                    orderId,
                    status: 'pending',
                    currency: 'UAH',
                }
            });

            this.processPaymentVerification(orderId, payment.id, bookingId, 2000);

            return payment;
        } catch (e) {
            throw new InternalException(e.message);
        }
    }

    async processPaymentVerification(orderId: string, paymentId: number, bookingId: number, delayMs: number = 0) {
        try {
            await new Promise(resolve => setTimeout(resolve, delayMs));

            const verifiedPayment = await this.fetchLiqPayStatus(orderId);

            await this.prisma.payment.update({
                where: {id: paymentId},
                data: {
                    status: verifiedPayment.status,
                    transactionId: verifiedPayment.payment_id,
                }
            });
            let status;
            if(verifiedPayment.status === 'success') status = 'paid'
            if(verifiedPayment.status === 'failed' || verifiedPayment.status === 'error') status = 'failed'

            if (verifiedPayment) {
                await this.prisma.booking.update({
                    where: {id: bookingId, status:{not: 'paid'}},
                    data: {status}
                });
            }
        }catch (e) {
            throw new InternalException(e.message);
        }
    }

}

