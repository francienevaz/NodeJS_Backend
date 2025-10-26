// src/appointments/dto/create-appointment.dto.ts
import { IsString, IsDateString, IsOptional, IsEnum } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
    @IsString()
    patientId: string;

    @IsString()
    serviceId: string;

    @IsString()
    doctorId: string;

    @IsDateString()
    scheduledAt: Date;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsEnum(AppointmentStatus)
    status?: AppointmentStatus;
}