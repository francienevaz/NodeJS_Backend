// src/patients/controllers/patient.controller.ts
import { Controller, Get, Post, Body, Param, Query, Patch, Delete } from '@nestjs/common';
import { PatientService } from '../services/patient.service';
import { CreatePatientDto } from '../dto/create-patient.dto';

@Controller('patients')
export class PatientController {
    constructor(private readonly patientService: PatientService) { }

    @Post()
    async create(@Body() createPatientDto: CreatePatientDto) {
        return this.patientService.create(createPatientDto);
    }

    @Get()
    async findAll(@Query('hospitalId') hospitalId?: string) {
        return this.patientService.findAll(hospitalId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.patientService.findById(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() updatePatientDto: any) {
        return this.patientService.update(id, updatePatientDto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return this.patientService.delete(id);
    }
}