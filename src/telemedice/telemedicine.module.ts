// src/telemedicine/telemedicine.module.ts
import { Module } from '@nestjs/common';
import { TeleSessionController } from './controllers/tele-session.controller';
import { TeleSessionService } from './services/tele-session.service';
import { TeleSessionRepository } from './repositories/tele-session.repository';

@Module({
    controllers: [TeleSessionController],
    providers: [TeleSessionService, TeleSessionRepository],
    exports: [TeleSessionService],
})
export class TelemedicineModule { }