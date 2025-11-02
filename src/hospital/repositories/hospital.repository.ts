// src/hospital/repositories/hospital.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// import { Hospital } from '@prisma/client';
import { CreateHospitalDto } from '../dto/create-hospital.dto';

@Injectable()
export class HospitalRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateHospitalDto) {
        return this.prisma.hospital.create({
            data,
            include: {
                users: true,
                patients: true,
            }
        });
    }

    async findByCnpj(cnpj: string) {
        return this.prisma.hospital.findUnique({
            where: { cnpj }
        });
    }

    async findById(id: string) {
        return this.prisma.hospital.findUnique({
            where: { id },
            include: {
                users: {
                    include: {
                        role: true,
                    }
                },
                patients: true,
            }
        });
    }

    async findAll() {
        return this.prisma.hospital.findMany({
            include: {
                _count: {
                    select: {
                        users: true,
                        patients: true,
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
    }

    async update(id: string, data) {
        return this.prisma.hospital.update({
            where: { id },
            data,
            include: {
                users: true,
                patients: true,
            }
        });
    }

    async getHospitalStats(hospitalId: string) {
        const [userCount, patientCount, appointmentCount, revenue] = await Promise.all([
            this.prisma.user.count({ where: { hospitalId } }),
            this.prisma.patient.count({ where: { hospitalId } }),
            this.prisma.appointment.count({
                where: {
                    patient: { hospitalId },
                    status: 'COMPLETED'
                }
            }),
            this.prisma.payment.aggregate({
                where: {
                    patient: { hospitalId },
                    status: 'COMPLETED'
                },
                _sum: { amount: true }
            })
        ]);

        return {
            userCount,
            patientCount,
            appointmentCount,
            totalRevenue: revenue._sum.amount || 0,
        };
    }
}