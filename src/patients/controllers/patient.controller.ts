import { Controller, Get, Post, Body, Param, Patch, Delete, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../shared/enums/payment.enums';
import { PatientService } from '../services/patient.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';

@Controller('patients')
@UseGuards(JwtAuthGuard)
@UseGuards(RolesGuard)
export class PatientController {
    constructor(private readonly patientService: PatientService) {}
    
    @Get()
    @Roles(UserRole.ADMIN, UserRole.PROFESSIONAL, UserRole.RECEPTIONIST)
    async findAll() {
        return this.patientService.findAll();
    }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.PROFESSIONAL, UserRole.RECEPTIONIST)
    async create(@Body() createPatientDto: CreatePatientDto) {
        return this.patientService.create(createPatientDto);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.PROFESSIONAL, UserRole.RECEPTIONIST)
    async findOne(@Param('id') id: string) {
        return this.patientService.findById(id);
    }

    @Patch(':id')
    @Roles(UserRole.ADMIN, UserRole.PROFESSIONAL, UserRole.RECEPTIONIST)
    async update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
        return this.patientService.update(id, updatePatientDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN) // Apenas admin pode deletar
    async remove(@Param('id') id: string) {
        return this.patientService.delete(id);
    }
}