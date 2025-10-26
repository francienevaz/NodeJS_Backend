// src/patients/controllers/patient.controller.ts
import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
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
}