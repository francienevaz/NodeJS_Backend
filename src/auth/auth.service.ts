// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';

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

        // Validação de role - agora verificamos pelo roleId/name
        const role = await this.usersService.findRoleById(registerDto.roleId);
        if (!role) {
            throw new BadRequestException('Invalid role');
        }

        // Bloqueia criação de ADMIN por registro público
        if (role.name === 'ADMIN') {
            throw new BadRequestException('Não é permitido o registro direto de administradores.');
        }

        const passwordHash = await bcrypt.hash(registerDto.password, 10);

        const user = await this.usersService.create({
            email: registerDto.email,
            fullName: registerDto.fullName,
            passwordHash,
            roleId: registerDto.roleId,
            phone: registerDto.phone,
            hospitalId: registerDto.hospitalId,
        });

        // Lógica de criação de perfis específicos baseada na role
        if (role.name === 'PROFESSIONAL') {
            // TODO: Implementar professionalService.create({ userId: user.id })
        }

        return this.login(user);
    }

    async validateUser(email: string, password: string) {
        const user = await this.usersService.findByEmailWithRole(email);
        if (!user) throw new UnauthorizedException('User not found');

        const isValid = await bcrypt.compare(password, user.passwordHash);
        if (!isValid) throw new UnauthorizedException('Invalid password');

        // Remove hash e inclui role no retorno
        const { passwordHash, ...result } = user;
        return {
            ...result,
            role: user.role.name // Inclui o nome da role no payload
        };
    }

    async login(user: any) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role // Agora é o nome da role
        };
        return {
            access_token: this.jwtService.sign(payload),
        };
    }
}