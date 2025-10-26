// src/clinical/services/clinical.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateMedicalNoteDto } from '../dto/create-medical-note.dto';
import { CreatePrescriptionDto } from '../dto/create-prescription.dto';

@Injectable()
export class ClinicalService {
    constructor(private readonly prisma: PrismaService) { }

    async createMedicalNote(createMedicalNoteDto: CreateMedicalNoteDto) {
        // Verify patient exists
        const patient = await this.prisma.patient.findUnique({
            where: { id: createMedicalNoteDto.patientId }
        });

        if (!patient) {
            throw new NotFoundException('Patient not found');
        }

        return this.prisma.medicalNote.create({
            data: createMedicalNoteDto,
            include: {
                patient: true,
                doctor: true,
            }
        });
    }

    async createPrescription(createPrescriptionDto: CreatePrescriptionDto) {
        // Verify patient exists
        const patient = await this.prisma.patient.findUnique({
            where: { id: createPrescriptionDto.patientId }
        });

        if (!patient) {
            throw new NotFoundException('Patient not found');
        }

        return this.prisma.prescription.create({
            data: createPrescriptionDto,
            include: {
                patient: true,
                doctor: true,
            }
        });
    }

    async getPatientMedicalRecords(patientId: string) {
        const [medicalNotes, prescriptions] = await Promise.all([
            this.prisma.medicalNote.findMany({
                where: { patientId },
                include: { doctor: true },
                orderBy: { createdAt: 'desc' }
            }),
            this.prisma.prescription.findMany({
                where: { patientId },
                include: { doctor: true },
                orderBy: { issuedAt: 'desc' }
            })
        ]);

        return { medicalNotes, prescriptions };
    }
}