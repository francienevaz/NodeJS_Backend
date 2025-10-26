// src/audit/audit.module.ts
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuditController } from './controllers/audit.controller';
import { AuditService } from './services/audit.service';
import { AuditLogRepository } from './repositories/audit-log.repository';
import { AuditInterceptor } from './interceptors/audit.interceptor';

@Module({
    controllers: [AuditController],
    providers: [
        AuditService,
        AuditLogRepository,
        {
            provide: APP_INTERCEPTOR,
            useClass: AuditInterceptor,
        },
    ],
    exports: [AuditService],
})
export class AuditModule { }