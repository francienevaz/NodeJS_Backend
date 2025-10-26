// src/audit/services/audit.service.ts
import { Injectable } from '@nestjs/common';
import { AuditLogRepository } from '../repositories/audit-log.repository';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { AuditLogEntity } from '../entities/audit-log.entity';

@Injectable()
export class AuditService {
    constructor(private readonly auditLogRepository: AuditLogRepository) { }

    async log(createAuditLogDto: CreateAuditLogDto): Promise<AuditLogEntity> {
        const log = await this.auditLogRepository.create(createAuditLogDto);
        return this.toEntity(log);
    }

    async getUserActivity(userId: string): Promise<AuditLogEntity[]> {
        const logs = await this.auditLogRepository.findByUserId(userId);
        return logs.map(log => this.toEntity(log));
    }

    async getEntityActivity(entity: string, entityId?: string): Promise<AuditLogEntity[]> {
        const logs = await this.auditLogRepository.findByEntity(entity, entityId);
        return logs.map(log => this.toEntity(log));
    }

    async getSystemActivity(startDate: Date, endDate: Date): Promise<AuditLogEntity[]> {
        const logs = await this.auditLogRepository.findInDateRange(startDate, endDate);
        return logs.map(log => this.toEntity(log));
    }

    async getAuditSummary(days: number = 30) {
        return this.auditLogRepository.getAuditSummary(days);
    }

    private toEntity(log: any): AuditLogEntity {
        return {
            id: log.id,
            userId: log.userId || undefined,
            action: log.action,
            entity: log.entity,
            entityId: log.entityId || undefined,
            metadata: log.metadata ? JSON.parse(log.metadata as string) : undefined,
            timestamp: log.timestamp,
        };
    }
}