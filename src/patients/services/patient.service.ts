// src/patients/services/patient.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PatientRepository } from '../repositories/patient.repository';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { PatientEntity } from '../entities/patient.entity';

@Injectable()
export class PatientService {
    constructor(private readonly patientRepository: PatientRepository) { }

    async create(createPatientDto: CreatePatientDto): Promise<PatientEntity> {
        // Check if patient with CPF already exists
        const existingPatient = await this.patientRepository.findByCpf(createPatientDto.cpf);
        if (existingPatient) {
            throw new ConflictException('Patient with this CPF already exists');
        }

        const patient = await this.patientRepository.create(createPatientDto);
        return this.toEntity(patient);
    }

    async findById(id: string): Promise<PatientEntity> {
        const patient = await this.patientRepository.findById(id);
        if (!patient) {
            throw new NotFoundException('Patient not found');
        }
        return this.toEntity(patient);
    }

    async findAll(hospitalId?: string): Promise<PatientEntity[]> {
        const patients = await this.patientRepository.findAll(hospitalId);
        return patients.map(patient => this.toEntity(patient));
    }

    private toEntity(patient: any): PatientEntity {
        return {
            id: patient.id,
            fullName: patient.fullName,
            cpf: patient.cpf,
            birthDate: patient.birthDate,
            phone: patient.phone,
            email: patient.email,
            address: patient.address,
            medicalRecordNumber: patient.medicalRecordNumber,
            hospitalId: patient.hospitalId,
            createdAt: patient.createdAt,
            updatedAt: patient.updatedAt,
        };
    }
}