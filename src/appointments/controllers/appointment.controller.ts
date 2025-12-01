import { Controller, Get, Post, Body, Param, Query, Patch, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/payment.enums';
import { AppointmentService } from '../services/appointment.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';

@Controller('appointments')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}
    
    @Post()
    @Roles(UserRole.ADMIN, UserRole.PROFESSIONAL, UserRole.RECEPTIONIST)
    async create(@Body() createAppointmentDto: CreateAppointmentDto) {
        return this.appointmentService.create(createAppointmentDto);
    }

    @Get('doctor/:doctorId')
    @Roles(UserRole.ADMIN, UserRole.PROFESSIONAL, UserRole.RECEPTIONIST)
    async findByDoctor(
        @Param('doctorId') doctorId: string,
        @Query('date') date?: string
    ) {
        const dateObj = date ? new Date(date) : undefined;
        return this.appointmentService.findByDoctor(doctorId, dateObj);
    }

    @Get('patient/:patientId')
    @Roles(UserRole.ADMIN, UserRole.PROFESSIONAL, UserRole.RECEPTIONIST, UserRole.PATIENT)
    async findByPatient(@Param('patientId') patientId: string) {
        return this.appointmentService.findByPatient(patientId);
    }

    @Patch(':id/cancel')
    @Roles(UserRole.ADMIN, UserRole.PROFESSIONAL, UserRole.RECEPTIONIST, UserRole.PATIENT)
    async cancel(@Param('id') id: string, @Body('reason') reason?: string) {
        return this.appointmentService.cancel(id, reason);
    }
}