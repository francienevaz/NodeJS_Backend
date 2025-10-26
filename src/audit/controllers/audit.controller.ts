// src/audit/controllers/audit.controller.ts
import { Controller, Get, Param, Query } from '@nestjs/common';
import { AuditService } from '../services/audit.service';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('audit')
@Roles(UserRole.ADMIN)
export class AuditController {
    constructor(private readonly auditService: AuditService) { }

    @Get('user/:userId')
    async getUserActivity(@Param('userId') userId: string) {
        return this.auditService.getUserActivity(userId);
    }

    @Get('entity/:entity')
    async getEntityActivity(
        @Param('entity') entity: string,
        @Query('entityId') entityId?: string,
    ) {
        return this.auditService.getEntityActivity(entity, entityId);
    }

    @Get('system')
    async getSystemActivity(
        @Query('startDate') startDate: string,
        @Query('endDate') endDate: string,
    ) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        return this.auditService.getSystemActivity(start, end);
    }

    @Get('summary')
    async getAuditSummary(@Query('days') days: number) {
        return this.auditService.getAuditSummary(days);
    }
}