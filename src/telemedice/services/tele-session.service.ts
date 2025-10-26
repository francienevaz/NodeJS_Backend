// src/telemedicine/services/tele-session.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { TeleSessionRepository } from '../repositories/tele-session.repository';
import { CreateTeleSessionDto } from '../dto/create-tele-session.dto';
import { TeleSessionEntity } from '../entities/tele-session.entity';

@Injectable()
export class TeleSessionService {
    constructor(private readonly teleSessionRepository: TeleSessionRepository) { }

    async create(createTeleSessionDto: CreateTeleSessionDto): Promise<TeleSessionEntity> {
        // Check for scheduling conflicts
        const conflictingSession = await this.teleSessionRepository.findByDoctor(createTeleSessionDto.doctorId)
            .then(sessions => sessions.find(session =>
                session.startTime.getTime() === new Date(createTeleSessionDto.startTime).getTime() &&
                !session.endTime
            ));

        if (conflictingSession) {
            throw new ConflictException('Doctor already has a telemedicine session at this time');
        }

        const session = await this.teleSessionRepository.create(createTeleSessionDto);
        return this.toEntity(session);
    }

    async findById(id: string): Promise<TeleSessionEntity> {
        const session = await this.teleSessionRepository.findById(id);
        if (!session) {
            throw new NotFoundException('Telemedicine session not found');
        }
        return this.toEntity(session);
    }

    async findByPatient(patientId: string): Promise<TeleSessionEntity[]> {
        const sessions = await this.teleSessionRepository.findByPatient(patientId);
        return sessions.map(session => this.toEntity(session));
    }

    async findByDoctor(doctorId: string): Promise<TeleSessionEntity[]> {
        const sessions = await this.teleSessionRepository.findByDoctor(doctorId);
        return sessions.map(session => this.toEntity(session));
    }

    async endSession(id: string, recordingUrl?: string): Promise<TeleSessionEntity> {
        const session = await this.teleSessionRepository.update(id, {
            endTime: new Date(),
            ...(recordingUrl && { recordingUrl })
        });
        return this.toEntity(session);
    }

    async getUpcomingSessions(): Promise<TeleSessionEntity[]> {
        const sessions = await this.teleSessionRepository.findUpcomingSessions();
        return sessions.map(session => this.toEntity(session));
    }

    private toEntity(session: any): TeleSessionEntity {
        return {
            id: session.id,
            patientId: session.patientId,
            doctorId: session.doctorId,
            startTime: session.startTime,
            endTime: session.endTime,
            sessionUrl: session.sessionUrl,
            notes: session.notes,
            recordingUrl: session.recordingUrl,
            createdAt: session.createdAt,
            updatedAt: session.updatedAt,
        };
    }
}