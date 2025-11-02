// src/hospital/controllers/hospital.controller.ts
import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { HospitalService } from '../services/hospital.service';
import { CreateHospitalDto } from '../dto/create-hospital.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../../src/shared/enums/payment.enums';
import { Audit } from '../../audit/decorators/audit.decorator';

@Controller('hospitals')
@Roles(UserRole.ADMIN)
export class HospitalController {
    constructor(private readonly hospitalService: HospitalService) { }

    @Post()
    @Audit({ action: 'CREATE', entity: 'Hospital' })
    async create(@Body() createHospitalDto: CreateHospitalDto) {
        return this.hospitalService.create(createHospitalDto);
    }

    @Get()
    async findAll() {
        return this.hospitalService.findAll();
    }

    @Get(':id')
    async findById(@Param('id') id: string) {
        return this.hospitalService.findById(id);
    }

    @Get(':id/stats')
    async getStats(@Param('id') id: string) {
        return this.hospitalService.getStats(id);
    }
}