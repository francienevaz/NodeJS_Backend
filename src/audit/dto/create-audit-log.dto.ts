// src/audit/dto/create-audit-log.dto.ts
import { IsString, IsOptional, IsObject } from 'class-validator';

export class CreateAuditLogDto {
    @IsOptional()
    @IsString()
    userId?: string;

    @IsString()
    action: string;

    @IsString()
    entity: string;

    @IsOptional()
    @IsString()
    entityId?: string;

    @IsOptional()
    @IsObject()
    metadata?: Record<string, any>;
}