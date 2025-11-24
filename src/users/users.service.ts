// src/users/users.service.ts
import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

type CreateUserDto = {
    email: string;
    fullName: string;
    passwordHash: string;
    roleId: string;
    phone?: string;
    hospitalId?: string;
};

type UpdateUserDto = {
    email?: string;
    fullName?: string;
    phone?: string;
    hospitalId?: string;
    isActive?: boolean;
};

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateUserDto) {
        try {
            // Check if user already exists
            const existingUser = await this.findByEmail(data.email);
            if (existingUser) {
                throw new ConflictException('User with this email already exists');
            }

            return this.prisma.user.create({
                data,
                include: { 
                    role: true,
                    hospital: true 
                }
            });
        } catch (error) {
            if (error instanceof ConflictException) {
                throw error;
            }
            throw new InternalServerErrorException('Error creating user');
        }
    }

    async findAll(hospitalId?: string) {
        const where = hospitalId ? { hospitalId } : {};
        return this.prisma.user.findMany({
            where,
            include: { 
                role: true,
                hospital: true 
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async findOne(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id },
            include: { 
                role: true,
                hospital: true,
                appointments: true
            }
        });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }

    async findByEmail(email: string) {
        return this.prisma.user.findUnique({
            where: { email }
        });
    }

    async findByEmailWithRole(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
            include: { role: true }
        });
    }

    async findById(id: string) {
        return this.prisma.user.findUnique({
            where: { id },
            include: { role: true }
        });
    }

    async update(id: string, data: UpdateUserDto) {
        // Check if user exists
        await this.findOne(id);

        // Check email uniqueness if email is being updated
        if (data.email) {
            const existingUser = await this.findByEmail(data.email);
            if (existingUser && existingUser.id !== id) {
                throw new ConflictException('Email already in use by another user');
            }
        }

        return this.prisma.user.update({
            where: { id },
            data,
            include: { 
                role: true,
                hospital: true 
            }
        });
    }

    async remove(id: string) {
        // Check if user exists
        await this.findOne(id);

        return this.prisma.user.delete({
            where: { id }
        });
    }

    async deactivate(id: string) {
        return this.update(id, { isActive: false });
    }

    async activate(id: string) {
        return this.update(id, { isActive: true });
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

    async findRoles() {
        return this.prisma.role.findMany();
    }

    async findByRole(roleName: string, hospitalId?: string) {
        const role = await this.findRoleByName(roleName);
        if (!role) {
            throw new NotFoundException(`Role ${roleName} not found`);
        }

        const where: any = { roleId: role.id };
        if (hospitalId) {
            where.hospitalId = hospitalId;
        }

        return this.prisma.user.findMany({
            where,
            include: {
                role: true,
                hospital: true
            }
        });
    }
}