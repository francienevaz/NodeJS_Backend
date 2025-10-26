// src/clinical/clinical.module.ts
import { Module } from '@nestjs/common';
import { ClinicalController } from './controllers/clinical.controller';
import { ClinicalService } from './services/clinical.service';

@Module({
    controllers: [ClinicalController],
    providers: [ClinicalService],
    exports: [ClinicalService],
})
export class ClinicalModule { }