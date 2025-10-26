// src/clinical/dto/create-prescription.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsDateString } from 'class-validator';

export class CreatePrescriptionDto {
    @IsString()
    @IsNotEmpty()
    patientId: string;

    @IsString()
    @IsNotEmpty()
    doctorId: string;

    @IsString()
    @IsNotEmpty()
    medication: string;

    @IsString()
    @IsNotEmpty()
    dosage: string;

    @IsOptional()
    @IsString()
    instructions?: string;

    @IsOptional()
    @IsDateString()
    expiresAt?: Date;
}