// src/patients/dto/create-patient.dto.ts
import { IsString, IsEmail, IsOptional, IsDateString } from 'class-validator';

export class CreatePatientDto {
    @IsString()
    fullName: string;

    @IsString()
    cpf: string;

    @IsDateString()
    birthDate: string;

    @IsString()
    phone: string;

    @IsOptional()
    @IsEmail()
    email?: string;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @IsString()
    medicalRecordNumber?: string;

    @IsOptional()
    @IsString()
    hospitalId?: string;
}