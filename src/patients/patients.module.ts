// src/patients/patients.module.ts
import { Module } from '@nestjs/common';
import { PatientController } from './controllers/patient.controller';
import { PatientService } from './services/patient.service';
import { PatientRepository } from './repositories/patient.repository';

@Module({
    controllers: [PatientController],
    providers: [PatientService, PatientRepository],
    exports: [PatientService],
})
export class PatientsModule { }