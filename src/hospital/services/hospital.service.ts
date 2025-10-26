// src/hospital/services/hospital.service.ts
import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { HospitalRepository } from '../repositories/hospital.repository';
import { CreateHospitalDto } from '../dto/create-hospital.dto';
import { HospitalEntity } from '../entities/hospital.entity';

@Injectable()
export class HospitalService {
    constructor(private readonly hospitalRepository: HospitalRepository) { }

    async create(createHospitalDto: CreateHospitalDto): Promise<HospitalEntity> {
        // Check if hospital with CNPJ already exists
        const existingHospital = await this.hospitalRepository.findByCnpj(createHospitalDto.cnpj);
        if (existingHospital) {
            throw new ConflictException('Hospital with this CNPJ already exists');
        }

        const hospital = await this.hospitalRepository.create(createHospitalDto);
        return this.toEntity(hospital);
    }

    async findById(id: string): Promise<HospitalEntity> {
        const hospital = await this.hospitalRepository.findById(id);
        if (!hospital) {
            throw new NotFoundException('Hospital not found');
        }
        return this.toEntity(hospital);
    }

    async findAll(): Promise<HospitalEntity[]> {
        const hospitals = await this.hospitalRepository.findAll();
        return hospitals.map(hospital => this.toEntity(hospital));
    }

    async getStats(hospitalId: string) {
        return this.hospitalRepository.getHospitalStats(hospitalId);
    }

    private toEntity(hospital: any): HospitalEntity {
        return {
            id: hospital.id,
            name: hospital.name,
            cnpj: hospital.cnpj,
            address: hospital.address,
            phone: hospital.phone,
            email: hospital.email,
            createdAt: hospital.createdAt,
            updatedAt: hospital.updatedAt,
        };
    }
}