// src/finance/services/payment.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentDto } from '../dto/create-payment.dto';
import { PaymentStatus } from '@prisma/client';

@Injectable()
export class PaymentService {
    constructor(private readonly prisma: PrismaService) { }

    async createPayment(createPaymentDto: CreatePaymentDto) {
        // Check if payment already exists for this appointment
        const existingPayment = await this.prisma.payment.findUnique({
            where: { appointmentId: createPaymentDto.appointmentId }
        });

        if (existingPayment) {
            throw new ConflictException('Payment already exists for this appointment');
        }

        // Verify appointment exists
        const appointment = await this.prisma.appointment.findUnique({
            where: { id: createPaymentDto.appointmentId }
        });

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        return this.prisma.payment.create({
            data: createPaymentDto,
            include: {
                appointment: true,
                patient: true,
            }
        });
    }

    async processPayment(paymentId: string, transactionId: string) {
        return this.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: PaymentStatus.COMPLETED,
                transactionId,
                paidAt: new Date(),
            },
            include: {
                appointment: true,
                patient: true,
            }
        });
    }

    async generateInvoice(paymentId: string) {
        const payment = await this.prisma.payment.findUnique({
            where: { id: paymentId },
            include: { appointment: true }
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        // Calculate due date (30 days from now)
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + 30);

        return this.prisma.invoice.create({
            data: {
                paymentId: payment.id,
                dueDate,
                totalAmount: payment.amount,
                // In a real scenario, you'd generate PDF and store URL
                pdfUrl: `/invoices/${paymentId}.pdf`,
            }
        });
    }

    async getFinancialReport(hospitalId?: string, startDate?: Date, endDate?: Date) {
        const where: any = {};

        if (hospitalId) {
            where.patient = { hospitalId };
        }

        if (startDate && endDate) {
            where.createdAt = {
                gte: startDate,
                lte: endDate
            };
        }

        const payments = await this.prisma.payment.findMany({
            where,
            include: {
                patient: true,
                appointment: {
                    include: {
                        service: true,
                        doctor: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        const totalRevenue = payments
            .filter(p => p.status === PaymentStatus.COMPLETED)
            .reduce((sum, payment) => sum + Number(payment.amount), 0);

        return {
            payments,
            totalRevenue,
            totalPayments: payments.length,
            completedPayments: payments.filter(p => p.status === PaymentStatus.COMPLETED).length,
        };
    }
}