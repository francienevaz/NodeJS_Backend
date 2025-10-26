// src/clinical/dto/create-medical-note.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateMedicalNoteDto {
    @IsString()
    @IsNotEmpty()
    patientId: string;

    @IsString()
    @IsNotEmpty()
    doctorId: string;

    @IsString()
    @IsNotEmpty()
    content: string;
}