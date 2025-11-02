// src/appointments/services/appointment.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { AppointmentStatus } from '../../../src/shared/enums/appointment-status.enum';

@Injectable()
export class AppointmentService {
    constructor(private readonly prisma: PrismaService) { }

    async create(createAppointmentDto: CreateAppointmentDto) {
        // Check for scheduling conflicts
        const conflictingAppointment = await this.prisma.appointment.findFirst({
            where: {
                doctorId: createAppointmentDto.doctorId,
                scheduledAt: createAppointmentDto.scheduledAt,
                status: {
                    in: [AppointmentStatus.SCHEDULED]
                }
            }
        });

        if (conflictingAppointment) {
            throw new ConflictException('Doctor is not available at this time');
        }

        return this.prisma.appointment.create({
            data: createAppointmentDto,
            include: {
                patient: true,
                service: true,
                doctor: true,
            }
        });
    }

    async cancel(id: string, reason?: string) {
        const appointment = await this.prisma.appointment.findUnique({
            where: { id }
        });

        if (!appointment) {
            throw new NotFoundException('Appointment not found');
        }

        return this.prisma.appointment.update({
            where: { id },
            data: {
                status: AppointmentStatus.CANCELLED,
                notes: reason ? `${appointment.notes || ''}\nCancelled: ${reason}`.trim() : appointment.notes
            }
        });
    }

    async findByDoctor(doctorId: string, date?: Date) {
        const where: any = { doctorId };
        if (date) {
            const startOfDay = new Date(date);
            startOfDay.setHours(0, 0, 0, 0);
            const endOfDay = new Date(date);
            endOfDay.setHours(23, 59, 59, 999);

            where.scheduledAt = {
                gte: startOfDay,
                lte: endOfDay
            };
        }

        return this.prisma.appointment.findMany({
            where,
            include: {
                patient: true,
                service: true,
            },
            orderBy: { scheduledAt: 'asc' }
        });
    }

    async findByPatient(patientId: string) {
        return this.prisma.appointment.findMany({
            where: { patientId },
            include: {
                service: true,
                doctor: true,
                payment: true,
            },
            orderBy: { scheduledAt: 'desc' }
        });
    }
}