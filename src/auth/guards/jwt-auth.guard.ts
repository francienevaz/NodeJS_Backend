import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
    
    canActivate(context: ExecutionContext) {
        console.log('=== JWT GUARD EXECUTING ===');
        return super.canActivate(context);
    }

    handleRequest(err, user, info) {
        console.log('=== JWT GUARD HANDLE REQUEST ===');
        console.log('Error:', err);
        console.log('User:', user);
        console.log('Info:', info);
        
        if (err || !user) {
            console.log('JWT Guard: Authentication failed');
            throw err || new UnauthorizedException('Authentication required');
        }
        
        console.log('JWT Guard: User authenticated successfully:', user);
        return user;
    }
}