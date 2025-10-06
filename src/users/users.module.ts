import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service'
import { PrismaService } from '../prisma/prisma.service' // Usaremos um módulo/serviço para o Prisma

@Module({
    providers: [UsersService, PrismaService], // Adicione o PrismaService
    exports: [UsersService],
})
export class UsersModule { }