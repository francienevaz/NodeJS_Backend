// src/patients/entities/patient.entity.ts
export class PatientEntity {
    id: string;
    fullName: string;
    cpf: string;
    birthDate: Date;
    phone: string;
    email?: string;
    address?: string;
    medicalRecordNumber?: string;
    hospitalId?: string;
    createdAt: Date;
    updatedAt: Date;
}