// src/users/users.module.ts
import { Module } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { UsersController } from '../users/controllers/users.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
    controllers: [UsersController],
    providers: [UsersService, PrismaService],
    exports: [UsersService],
})
export class UsersModule { }