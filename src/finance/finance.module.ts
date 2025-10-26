// src/finance/finance.module.ts
import { Module } from '@nestjs/common';
import { FinanceController } from './controllers/finance.controller';
import { PaymentService } from './services/payment.service';

@Module({
    controllers: [FinanceController],
    providers: [PaymentService],
    exports: [PaymentService],
})
export class FinanceModule { }