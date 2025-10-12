// prisma/seed.ts
import { PrismaClient, UserRole, AppointmentStatus, PaymentMethod, PaymentStatus, PrescriptionStatus } from '../generated/prisma';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Iniciando seed do banco de dados...');

    // 1. Criar Roles
    console.log('Criando roles...');
    const roles = await Promise.all([
        prisma.role.upsert({
            where: { name: 'ADMIN' },
            update: {},
            create: {
                name: 'ADMIN',
                description: 'Administrador do sistema'
            }
        }),
        prisma.role.upsert({
            where: { name: 'PROFESSIONAL' },
            update: {},
            create: {
                name: 'PROFESSIONAL',
                description: 'Médico/Profissional de saúde'
            }
        }),
        prisma.role.upsert({
            where: { name: 'RECEPTIONIST' },
            update: {},
            create: {
                name: 'RECEPTIONIST',
                description: 'Recepcionista'
            }
        }),
        prisma.role.upsert({
            where: { name: 'FINANCIAL' },
            update: {},
            create: {
                name: 'FINANCIAL',
                description: 'Setor financeiro'
            }
        })
    ]);

    console.log('Roles criadas:', roles.map(r => r.name));

    // 2. Criar Hospital
    console.log('Criando hospital...');
    const hospital = await prisma.hospital.upsert({
        where: { cnpj: '12345678000195' },
        update: {},
        create: {
            name: 'Hospital Central',
            cnpj: '12345678000195',
            address: 'Rua Principal, 123 - Centro, São Paulo - SP',
            phone: '+551133334444',
            email: 'contato@hospitalcentral.com'
        }
    });

    console.log('Hospital criado:', hospital.name);

    // 3. Criar Usuários
    console.log('Criando usuários...');
    const passwordHash = await bcrypt.hash('senha123', 10);

    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@hospital.com' },
        update: {},
        create: {
            email: 'admin@hospital.com',
            passwordHash,
            fullName: 'Administrador Sistema',
            phone: '+5511999999999',
            roleId: roles.find(r => r.name === 'ADMIN')!.id,
            hospitalId: hospital.id
        }
    });

    const doctorUser = await prisma.user.upsert({
        where: { email: 'dr.silva@hospital.com' },
        update: {},
        create: {
            email: 'dr.silva@hospital.com',
            passwordHash,
            fullName: 'Dr. João Silva',
            phone: '+551188887777',
            roleId: roles.find(r => r.name === 'PROFESSIONAL')!.id,
            hospitalId: hospital.id
        }
    });

    const receptionistUser = await prisma.user.upsert({
        where: { email: 'recepcao@hospital.com' },
        update: {},
        create: {
            email: 'recepcao@hospital.com',
            passwordHash,
            fullName: 'Maria Santos',
            phone: '+551177776666',
            roleId: roles.find(r => r.name === 'RECEPTIONIST')!.id,
            hospitalId: hospital.id
        }
    });

    console.log('Usuários criados');

    // 4. Criar Pacientes
    console.log('Criando pacientes...');
    const patients = await Promise.all([
        prisma.patient.upsert({
            where: { cpf: '12345678900' },
            update: {},
            create: {
                fullName: 'Carlos Oliveira',
                cpf: '12345678900',
                birthDate: new Date('1985-05-15'),
                phone: '+551166665555',
                email: 'carlos@email.com',
                address: 'Av. Brasil, 456 - Jardins, São Paulo - SP',
                medicalRecordNumber: 'MRN001',
                hospitalId: hospital.id
            }
        }),
        prisma.patient.upsert({
            where: { cpf: '98765432100' },
            update: {},
            create: {
                fullName: 'Ana Costa',
                cpf: '98765432100',
                birthDate: new Date('1990-08-22'),
                phone: '+551155554444',
                email: 'ana@email.com',
                address: 'Rua das Flores, 789 - Centro, São Paulo - SP',
                medicalRecordNumber: 'MRN002',
                hospitalId: hospital.id
            }
        })
    ]);

    console.log('Pacientes criados:', patients.map(p => p.fullName));

    // 5. Criar Serviços
    console.log('Criando serviços...');
    const services = await Promise.all([
        prisma.service.upsert({
            where: { id: 'service_consulta_clinica_geral' },
            update: {},
            create: {
                id: 'service_consulta_clinica_geral',
                name: 'Consulta Clínica Geral',
                description: 'Consulta médica de clínica geral',
                price: 150.00,
                durationMinutes: 30
            }
        }),
        prisma.service.upsert({
            where: { id: 'service_consulta_cardiologia' },
            update: {},
            create: {
                id: 'service_consulta_cardiologia',
                name: 'Consulta Cardiologia',
                description: 'Consulta especializada em cardiologia',
                price: 250.00,
                durationMinutes: 45
            }
        }),
        prisma.service.upsert({
            where: { id: 'service_exame_sangue' },
            update: {},
            create: {
                id: 'service-exame-sangue',
                name: 'Exame de Sangue',
                description: 'Coleta e análise de sangue',
                price: 80.00,
                durationMinutes: 15
            }
        })
    ]);

    console.log('Serviços criados:', services.map(s => s.name));

    // 6. Criar Agendamentos
    console.log('Criando agendamentos...');
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(9, 0, 0, 0);

    const appointment = await prisma.appointment.create({
        data: {
            patientId: patients[0].id,
            serviceId: services[0].id,
            doctorId: doctorUser.id,
            scheduledAt: tomorrow,
            status: AppointmentStatus.SCHEDULED,
            notes: 'Paciente com queixa de dor de cabeça'
        }
    });

    console.log('Agendamento criado');

    // 7. Criar Pagamento
    console.log('Criando pagamento...');
    const payment = await prisma.payment.create({
        data: {
            appointmentId: appointment.id,
            patientId: patients[0].id,
            amount: services[0].price,
            method: PaymentMethod.PIX,
            status: PaymentStatus.PENDING
        }
    });

    console.log('Pagamento criado');

    // 8. Criar Prescrição
    console.log('Criando prescrição...');
    const prescription = await prisma.prescription.create({
        data: {
            patientId: patients[0].id,
            doctorId: doctorUser.id,
            medication: 'Paracetamol',
            dosage: '500mg',
            instructions: 'Tomar 1 comprimido a cada 6 horas em caso de dor',
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 dias
        }
    });

    console.log('Prescrição criada');

    // 9. Criar Nota Médica
    console.log('Criando nota médica...');
    const medicalNote = await prisma.medicalNote.create({
        data: {
            patientId: patients[0].id,
            doctorId: doctorUser.id,
            content: 'Paciente apresenta sintomas de enxaqueca. Recomendado repouso e medicamento prescrito.'
        }
    });

    console.log('Nota médica criada');

    console.log('Seed concluído com sucesso!');
}

main()
    .catch((e) => {
        console.error('❌ Erro no seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });