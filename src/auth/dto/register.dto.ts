import { IsEmail, IsEnum, IsString, MinLength } from 'class-validator';
import { UserRole } from '@prisma/client'; // Reutilize o enum do Prisma

export class RegisterDto {
    @IsEmail()
    email: string;

    @IsString()
    name: string;

    @IsString()
    @MinLength(6)
    password: string;

    @IsEnum(UserRole)
    role: UserRole; // Define o papel do usuário (ADMIN, PROFESSIONAL, etc.)
}