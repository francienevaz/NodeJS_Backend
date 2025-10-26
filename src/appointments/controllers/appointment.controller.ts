// src/appointments/controllers/appointment.controller.ts
import { Controller, Get, Post, Body, Param, Query, Patch } from '@nestjs/common';
import { AppointmentService } from '../services/appointment.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';

@Controller('appointments')
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) { }

    @Post()
    async create(@Body() createAppointmentDto: CreateAppointmentDto) {
        return this.appointmentService.create(createAppointmentDto);
    }

    @Get('doctor/:doctorId')
    async findByDoctor(
        @Param('doctorId') doctorId: string,
        @Query('date') date?: string
    ) {
        const dateObj = date ? new Date(date) : undefined;
        return this.appointmentService.findByDoctor(doctorId, dateObj);
    }

    @Get('patient/:patientId')
    async findByPatient(@Param('patientId') patientId: string) {
        return this.appointmentService.findByPatient(patientId);
    }

    @Patch(':id/cancel')
    async cancel(@Param('id') id: string, @Body('reason') reason?: string) {
        return this.appointmentService.cancel(id, reason);
    }
}