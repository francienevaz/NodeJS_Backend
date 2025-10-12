// src/auth/dto/register.dto.ts
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(2)
    fullName: string; // Mudou de 'name' para 'fullName'

    @IsString()
    @MinLength(6)
    password: string;

    @IsString()
    roleId: string; // Mudou de 'role' para 'roleId'

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    hospitalId?: string;
}