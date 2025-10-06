import { Controller, Post, Body, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @Post('login')
    async login(@Body() loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.authService.validateUser(email, password);
        // O validateUser já lança UnauthorizedException, mas mantemos a verificação por clareza.
        if (!user) throw new UnauthorizedException();
        return this.authService.login(user);
    }

    @Post('register')
    async register(@Body() registerDto: RegisterDto) {
        // Exemplo: Bloqueia o registro de novos Admins por um endpoint público, se necessário.
        if (registerDto.role === 'ADMIN') {
            throw new BadRequestException('Não é permitido o registro direto de administradores.');
        }

        // O AuthService irá criar o User no DB e retornar o token
        return this.authService.register(registerDto);
    }
}