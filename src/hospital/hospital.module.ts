// src/hospital/hospital.module.ts
import { Module } from '@nestjs/common';
import { HospitalController } from './controllers/hospital.controller';
import { HospitalService } from './services/hospital.service';
import { HospitalRepository } from './repositories/hospital.repository';

@Module({
    controllers: [HospitalController],
    providers: [HospitalService, HospitalRepository],
    exports: [HospitalService],
})
export class HospitalModule { }