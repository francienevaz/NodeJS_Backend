// src/audit/interceptors/audit.interceptor.ts
import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuditService } from '../services/audit.service';
import { AUDIT_KEY, AuditOptions } from '../decorators/audit.decorator';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
    constructor(
        private reflector: Reflector,
        private auditService: AuditService,
    ) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const auditOptions = this.reflector.get<AuditOptions>(
            AUDIT_KEY,
            context.getHandler(),
        );

        if (!auditOptions) {
            return next.handle();
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        return next.handle().pipe(
            tap(async (data) => {
                try {
                    const entityId = this.resolveEntityId(auditOptions.entityId, data, request);

                    await this.auditService.log({
                        userId: user?.userId,
                        action: auditOptions.action,
                        entity: auditOptions.entity,
                        entityId: entityId || undefined, // Ensure it's either string or undefined
                        metadata: {
                            method: request.method,
                            url: request.url,
                            userAgent: request.get('user-agent'),
                            ip: request.ip,
                            response: data,
                        },
                    });
                } catch (error) {
                    // Don't break the request if audit logging fails
                    console.error('Audit logging failed:', error);
                }
            }),
        );
    }

    private resolveEntityId(
        entityIdTemplate: string | undefined,
        data: any,
        request: any
    ): string | undefined {
        if (!entityIdTemplate) return undefined;

        // Support templates like :id, :patientId, etc.
        return entityIdTemplate.replace(/:\w+/g, (match) => {
            const key = match.slice(1);
            return (
                data?.[key] ||
                request.params?.[key] ||
                request.body?.[key] ||
                match
            );
        });
    }
}