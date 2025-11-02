// src/patients/repositories/patient.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// import { Patient } from '@prisma/client';
import { CreatePatientDto } from '../dto/create-patient.dto';

@Injectable()
export class PatientRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreatePatientDto) {
        return this.prisma.patient.create({ data });
    }

    async findByCpf(cpf: string) {
        return this.prisma.patient.findUnique({ where: { cpf } });
    }

    async findById(id: string) {
        return this.prisma.patient.findUnique({
            where: { id },
            include: {
                appointments: true,
                prescriptions: true,
                medicalNotes: true,
            }
        });
    }

    async findAll(hospitalId?: string) {
        const where = hospitalId ? { hospitalId } : {};
        return this.prisma.patient.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
    }

    async update(id: string, data) {
        return this.prisma.patient.update({ where: { id }, data });
    }
}