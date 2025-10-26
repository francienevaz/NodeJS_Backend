// src/telemedicine/controllers/tele-session.controller.ts
import { Controller, Get, Post, Body, Param, Patch, Query } from '@nestjs/common';
import { TeleSessionService } from '../services/tele-session.service';
import { CreateTeleSessionDto } from '../dto/create-tele-session.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '@prisma/client';

@Controller('telemedicine')
export class TeleSessionController {
    constructor(private readonly teleSessionService: TeleSessionService) { }

    @Post('sessions')
    @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
    async create(@Body() createTeleSessionDto: CreateTeleSessionDto) {
        return this.teleSessionService.create(createTeleSessionDto);
    }

    @Get('sessions/:id')
    async findById(@Param('id') id: string) {
        return this.teleSessionService.findById(id);
    }

    @Get('sessions/patient/:patientId')
    async findByPatient(@Param('patientId') patientId: string) {
        return this.teleSessionService.findByPatient(patientId);
    }

    @Get('sessions/doctor/:doctorId')
    async findByDoctor(@Param('doctorId') doctorId: string) {
        return this.teleSessionService.findByDoctor(doctorId);
    }

    @Get('sessions/upcoming')
    async getUpcomingSessions() {
        return this.teleSessionService.getUpcomingSessions();
    }

    @Patch('sessions/:id/end')
    @Roles(UserRole.PROFESSIONAL, UserRole.ADMIN)
    async endSession(
        @Param('id') id: string,
        @Body('recordingUrl') recordingUrl?: string
    ) {
        return this.teleSessionService.endSession(id, recordingUrl);
    }
}