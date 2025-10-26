// src/finance/controllers/finance.controller.ts
import { Controller, Post, Body, Param, Get, Query, Patch } from '@nestjs/common';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';

@Controller('finance')
export class FinanceController {
    constructor(private readonly paymentService: PaymentService) { }

    @Post('payments')
    async createPayment(@Body() createPaymentDto: CreatePaymentDto) {
        return this.paymentService.createPayment(createPaymentDto);
    }

    @Patch('payments/:id/process')
    async processPayment(
        @Param('id') id: string,
        @Body('transactionId') transactionId: string
    ) {
        return this.paymentService.processPayment(id, transactionId);
    }

    @Post('payments/:id/invoice')
    async generateInvoice(@Param('id') id: string) {
        return this.paymentService.generateInvoice(id);
    }

    @Get('reports')
    async getFinancialReport(
        @Query('hospitalId') hospitalId?: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        return this.paymentService.getFinancialReport(hospitalId, start, end);
    }
}