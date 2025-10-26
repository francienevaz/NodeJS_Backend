// src/clinical/controllers/clinical.controller.ts
import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ClinicalService } from '../services/clinical.service';
import { CreateMedicalNoteDto } from '../dto/create-medical-note.dto';
import { CreatePrescriptionDto } from '../dto/create-prescription.dto';

@Controller('clinical')
export class ClinicalController {
    constructor(private readonly clinicalService: ClinicalService) { }

    @Post('medical-notes')
    async createMedicalNote(@Body() createMedicalNoteDto: CreateMedicalNoteDto) {
        return this.clinicalService.createMedicalNote(createMedicalNoteDto);
    }

    @Post('prescriptions')
    async createPrescription(@Body() createPrescriptionDto: CreatePrescriptionDto) {
        return this.clinicalService.createPrescription(createPrescriptionDto);
    }

    @Get('patient/:patientId/records')
    async getPatientRecords(@Param('patientId') patientId: string) {
        return this.clinicalService.getPatientMedicalRecords(patientId);
    }
}