import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '../../../src/shared/enums/payment.enums';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);

        // Se não há roles requeridas, permite acesso
        if (!requiredRoles) {
            return true;
        }

        const request = context.switchToHttp().getRequest();
        const user = request.user;

        // Verifica se o usuário existe
        if (!user) {
            throw new UnauthorizedException('User not authenticated');
        }

        // Verifica se o usuário tem role
        if (!user.role) {
            throw new UnauthorizedException('User role not found');
        }

        return requiredRoles.some((role) => user.role === role);
    }
}