// src/audit/entities/audit-log.entity.ts
export class AuditLogEntity {
    id: string;
    userId?: string;
    action: string;
    entity: string;
    entityId?: string;
    metadata?: Record<string, any>;
    timestamp: Date;
}