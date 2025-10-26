// src/telemedicine/dto/create-tele-session.dto.ts
import { IsString, IsDateString, IsOptional, IsUrl } from 'class-validator';

export class CreateTeleSessionDto {
    @IsString()
    patientId: string;

    @IsString()
    doctorId: string;

    @IsDateString()
    startTime: Date;

    @IsOptional()
    @IsDateString()
    endTime?: Date;

    @IsUrl()
    sessionUrl: string;

    @IsOptional()
    @IsString()
    notes?: string;

    @IsOptional()
    @IsUrl()
    recordingUrl?: string;
}