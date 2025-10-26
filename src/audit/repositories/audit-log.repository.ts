// src/audit/repositories/audit-log.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLog } from '@prisma/client';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';

@Injectable()
export class AuditLogRepository {
    constructor(private readonly prisma: PrismaService) { }

    async create(data: CreateAuditLogDto): Promise<AuditLog> {
        return this.prisma.auditLog.create({
            data: {
                ...data,
                metadata: data.metadata ? JSON.stringify(data.metadata) : undefined,
            },
            include: {
                user: true,
            }
        });
    }

    async findByUserId(userId: string): Promise<AuditLog[]> {
        return this.prisma.auditLog.findMany({
            where: { userId },
            include: {
                user: true,
            },
            orderBy: { timestamp: 'desc' }
        });
    }

    async findByEntity(entity: string, entityId?: string): Promise<AuditLog[]> {
        const where: any = { entity };
        if (entityId) {
            where.entityId = entityId;
        }

        return this.prisma.auditLog.findMany({
            where,
            include: {
                user: true,
            },
            orderBy: { timestamp: 'desc' }
        });
    }

    async findInDateRange(startDate: Date, endDate: Date): Promise<AuditLog[]> {
        return this.prisma.auditLog.findMany({
            where: {
                timestamp: {
                    gte: startDate,
                    lte: endDate,
                },
            },
            include: {
                user: true,
            },
            orderBy: { timestamp: 'desc' }
        });
    }

    async getAuditSummary(days: number = 30) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const logs = await this.prisma.auditLog.groupBy({
            by: ['action', 'entity'],
            where: {
                timestamp: {
                    gte: startDate,
                },
            },
            _count: {
                id: true,
            },
        });

        return logs.map(log => ({
            action: log.action,
            entity: log.entity,
            count: log._count.id,
        }));
    }
}