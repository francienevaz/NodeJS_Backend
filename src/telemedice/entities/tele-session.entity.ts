// src/telemedicine/entities/tele-session.entity.ts
export class TeleSessionEntity {
    id: string;
    patientId: string;
    doctorId: string;
    startTime: Date;
    endTime?: Date;
    sessionUrl: string;
    notes?: string;
    recordingUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}