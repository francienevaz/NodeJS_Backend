import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { User, UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
    ) { }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersService.findByEmail(registerDto.email);
        if (existingUser) {
            throw new BadRequestException('User with this email already exists.');
        }

        const passwordHash = await bcrypt.hash(registerDto.password, 10);

        const user = await this.usersService.create({
            email: registerDto.email,
            name: registerDto.name,
            passwordHash,
            role: registerDto.role,
        });

        // Lógica de criação de PERFIS de domínio (Admin, Professional) viria aqui, 
        // mas é melhor movê-la para um "Domain Service" ou Evento. Por simplicidade,
        // vamos simular a criação do perfil Profissional.
        if (user.role === UserRole.PROFESSIONAL) {
            // **TODO:** Implementar o serviço de criação de Professional
            // Exemplo: await this.professionalService.create({ userId: user.id });
        }

        return this.login(user); // Gera e retorna o token JWT
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmail(email);
        if (!user) throw new UnauthorizedException('User not found');

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) throw new UnauthorizedException('Invalid password');

        // remove hash before returning
        const { passwordHash, ...result } = user;
        return result;
    }

    async login(user: any) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}