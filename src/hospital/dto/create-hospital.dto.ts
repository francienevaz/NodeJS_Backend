// src/hospital/dto/create-hospital.dto.ts
import { IsString, IsOptional, IsEmail } from 'class-validator';

export class CreateHospitalDto {
    @IsString()
    name: string;

    @IsString()
    cnpj: string;

    @IsString()
    address: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsEmail()
    email?: string;
}