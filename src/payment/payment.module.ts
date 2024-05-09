import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentResolver } from './payment.resolver';
import { PaymentController } from './payment.controller';
import {PrismaService} from "../prisma.service";


@Module({
  imports: [],
  controllers: [PaymentController],
  providers: [PaymentResolver, PaymentService, PrismaService]
})
export class PaymentModule {}
