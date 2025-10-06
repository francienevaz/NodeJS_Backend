import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service'
import { User, UserRole } from '@prisma/client';

// O DTO de Registro seria diferente do LoginDto, incluindo 'name' e 'role'
type RegisterUserDto = { email: string, name: string, passwordHash: string, role: UserRole };

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { email } });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({ where: { id } });
    }

    async create(data: RegisterUserDto): Promise<User> {
        try {
            return this.prisma.user.create({ data });
        } catch (error) {
            // Lidar com erros de unicidade, etc.
            throw new InternalServerErrorException('Error creating user.');
        }
    }
}