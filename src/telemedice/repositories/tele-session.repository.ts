// src/telemedicine/repositories/tele-session.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
// import { TeleSession } from '@prisma/client';
import { CreateTeleSessionDto } from '../dto/create-tele-session.dto';

@Injectable()
export class TeleSessionRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateTeleSessionDto) {
        return this.prisma.teleSession.create({
            data,
            include: {
                patient: true,
                doctor: true,
            }
        });
    }

    async findById(id: string) {
        return this.prisma.teleSession.findUnique({
            where: { id },
            include: {
                patient: true,
                doctor: true,
            }
        });
    }

    async findByPatient(patientId: string) {
        return this.prisma.teleSession.findMany({
            where: { patientId },
            include: {
                doctor: true,
            },
            orderBy: { startTime: 'desc' }
        });
    }

    async findByDoctor(doctorId: string) {
        return this.prisma.teleSession.findMany({
            where: { doctorId },
            include: {
                patient: true,
            },
            orderBy: { startTime: 'desc' }
        });
    }

    async update(id: string, data) {
        return this.prisma.teleSession.update({
            where: { id },
            data,
            include: {
                patient: true,
                doctor: true,
            }
        });
    }

    async findUpcomingSessions() {
        return this.prisma.teleSession.findMany({
            where: {
                startTime: {
                    gte: new Date(),
                },
                endTime: null,
            },
            include: {
                patient: true,
                doctor: true,
            },
            orderBy: { startTime: 'asc' }
        });
    }
}