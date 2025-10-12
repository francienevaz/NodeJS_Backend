// src/users/users.service.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

type CreateUserDto = {
    email: string;
    fullName: string;
    passwordHash: string;
    roleId: string;
    phone?: string;
    hospitalId?: string;
};

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async findByEmail(email: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { email }
        });
    }

    async findByEmailWithRole(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            include: { role: true } // Inclui a role relacionada
        });
    }

    async findById(id: string): Promise<User | null> {
        return this.prisma.user.findUnique({
            where: { id },
            include: { role: true }
        });
    }

    async findRoleById(roleId: string) {
        return this.prisma.role.findUnique({
            where: { id: roleId }
        });
    }

    async findRoleByName(roleName: string) {
        return this.prisma.role.findUnique({
            where: { name: roleName }
        });
    }

    async create(data: CreateUserDto): Promise<User> {
        try {
            return this.prisma.user.create({
                data,
                include: { role: true }
            });
        } catch (error) {
            throw new InternalServerErrorException('Error creating user.');
        }
    }
}