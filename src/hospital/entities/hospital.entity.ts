// src/hospital/entities/hospital.entity.ts
export class HospitalEntity {
    id: string;
    name: string;
    cnpj: string;
    address: string;
    phone?: string;
    email?: string;
    createdAt: Date;
    updatedAt: Date;
}