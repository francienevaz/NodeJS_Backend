// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { PaymentMethod, PaymentStatus, PrescriptionStatus} from '../src/shared/enums/payment.enums';
import { AppointmentStatus } from '../src/shared/enums/appointment-status.enum';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting comprehensive database seed...');

    // 1. Create Roles
    console.log('Creating roles...');
    const roles = await Promise.all([
        prisma.role.upsert({
            where: { name: 'ADMIN' },
            update: {},
            create: {
                name: 'ADMIN',
                description: 'System Administrator'
            }
        }),
        prisma.role.upsert({
            where: { name: 'PROFESSIONAL' },
            update: {},
            create: {
                name: 'PROFESSIONAL',
                description: 'Medical Professional'
            }
        }),
        prisma.role.upsert({
            where: { name: 'RECEPTIONIST' },
            update: {},
            create: {
                name: 'RECEPTIONIST',
                description: 'Reception Staff'
            }
        }),
        prisma.role.upsert({
            where: { name: 'FINANCIAL' },
            update: {},
            create: {
                name: 'FINANCIAL',
                description: 'Financial Department'
            }
        })
    ]);

    console.log('Roles created:', roles.map(r => r.name));

    // 2. Create Hospitals
    console.log('Creating hospitals...');
    const hospitals = await Promise.all([
        prisma.hospital.upsert({
            where: { cnpj: '12345678000195' },
            update: {},
            create: {
                name: 'Central Hospital',
                cnpj: '12345678000195',
                address: 'Main Street, 123 - Downtown, São Paulo - SP',
                phone: '+551133334444',
                email: 'contact@centralhospital.com'
            }
        }),
        prisma.hospital.upsert({
            where: { cnpj: '98765432000187' },
            update: {},
            create: {
                name: 'North Medical Center',
                cnpj: '98765432000187',
                address: 'North Avenue, 456 - North Zone, São Paulo - SP',
                phone: '+551122223333',
                email: 'info@northmedical.com'
            }
        })
    ]);

    console.log('Hospitals created:', hospitals.map(h => h.name));

    // 3. Create Users for both hospitals
    console.log('Creating users...');
    const passwordHash = await bcrypt.hash('password123', 10);

    // Central Hospital Users
    const adminUser = await prisma.user.upsert({
        where: { email: 'admin@centralhospital.com' },
        update: {},
        create: {
            email: 'admin@centralhospital.com',
            passwordHash,
            fullName: 'System Administrator',
            phone: '+5511999999999',
            roleId: roles.find(r => r.name === 'ADMIN')!.id,
            hospitalId: hospitals[0].id
        }
    });

    const doctorsCentral = await Promise.all([
        prisma.user.upsert({
            where: { email: 'dr.silva@centralhospital.com' },
            update: {},
            create: {
                email: 'dr.silva@centralhospital.com',
                passwordHash,
                fullName: 'Dr. João Silva',
                phone: '+551188887777',
                roleId: roles.find(r => r.name === 'PROFESSIONAL')!.id,
                hospitalId: hospitals[0].id
            }
        }),
        prisma.user.upsert({
            where: { email: 'dra.santos@centralhospital.com' },
            update: {},
            create: {
                email: 'dra.santos@centralhospital.com',
                passwordHash,
                fullName: 'Dra. Maria Santos',
                phone: '+551188886666',
                roleId: roles.find(r => r.name === 'PROFESSIONAL')!.id,
                hospitalId: hospitals[0].id
            }
        })
    ]);

    const receptionistCentral = await prisma.user.upsert({
        where: { email: 'reception@centralhospital.com' },
        update: {},
        create: {
            email: 'reception@centralhospital.com',
            passwordHash,
            fullName: 'Carlos Oliveira',
            phone: '+551177776666',
            roleId: roles.find(r => r.name === 'RECEPTIONIST')!.id,
            hospitalId: hospitals[0].id
        }
    });

    const financialCentral = await prisma.user.upsert({
        where: { email: 'finance@centralhospital.com' },
        update: {},
        create: {
            email: 'finance@centralhospital.com',
            passwordHash,
            fullName: 'Ana Costa',
            phone: '+551166665555',
            roleId: roles.find(r => r.name === 'FINANCIAL')!.id,
            hospitalId: hospitals[0].id
        }
    });

    // North Medical Center Users
    const doctorNorth = await prisma.user.upsert({
        where: { email: 'dr.pereira@northmedical.com' },
        update: {},
        create: {
            email: 'dr.pereira@northmedical.com',
            passwordHash,
            fullName: 'Dr. Roberto Pereira',
            phone: '+551155554444',
            roleId: roles.find(r => r.name === 'PROFESSIONAL')!.id,
            hospitalId: hospitals[1].id
        }
    });

    console.log('Users created');

    // 4. Create Patients for both hospitals
    console.log('Creating patients...');
    const patientsCentral = await Promise.all([
        prisma.patient.upsert({
            where: { cpf: '12345678900' },
            update: {},
            create: {
                fullName: 'Carlos Oliveira',
                cpf: '12345678900',
                birthDate: '1985-05-15',
                phone: '+551166665555',
                email: 'carlos@email.com',
                address: 'Brazil Avenue, 456 - Gardens, São Paulo - SP',
                medicalRecordNumber: 'MRN001',
                hospitalId: hospitals[0].id
            }
        }),
        prisma.patient.upsert({
            where: { cpf: '98765432100' },
            update: {},
            create: {
                fullName: 'Ana Costa',
                cpf: '98765432100',
                birthDate: '1990-08-22',
                phone: '+551155554444',
                email: 'ana@email.com',
                address: 'Flowers Street, 789 - Downtown, São Paulo - SP',
                medicalRecordNumber: 'MRN002',
                hospitalId: hospitals[0].id
            }
        }),
        prisma.patient.upsert({
            where: { cpf: '45678912300' },
            update: {},
            create: {
                fullName: 'Pedro Almeida',
                cpf: '45678912300',
                birthDate: '1978-12-10',
                phone: '+551144443333',
                email: 'pedro@email.com',
                address: 'Liberty Avenue, 321 - West Zone, São Paulo - SP',
                medicalRecordNumber: 'MRN003',
                hospitalId: hospitals[0].id
            }
        })
    ]);

    const patientsNorth = await Promise.all([
        prisma.patient.upsert({
            where: { cpf: '78912345600' },
            update: {},
            create: {
                fullName: 'Fernanda Lima',
                cpf: '78912345600',
                birthDate: '1992-03-25',
                phone: '+551133332222',
                email: 'fernanda@email.com',
                address: 'North Street, 654 - North Zone, São Paulo - SP',
                medicalRecordNumber: 'MRN004',
                hospitalId: hospitals[1].id
            }
        }),
        prisma.patient.upsert({
            where: { cpf: '32165498700' },
            update: {},
            create: {
                fullName: 'Ricardo Souza',
                cpf: '32165498700',
                birthDate: '1988-07-18',
                phone: '+551122221111',
                email: 'ricardo@email.com',
                address: 'Central Avenue, 987 - Downtown, São Paulo - SP',
                medicalRecordNumber: 'MRN005',
                hospitalId: hospitals[1].id
            }
        })
    ]);

    console.log('Patients created');

    // 5. Create Services
    console.log('Creating services...');
    const services = await Promise.all([
        prisma.service.upsert({
            where: { id: 'General_Consultation' },
            update: {},
            create: {
                name: 'General Consultation',
                description: 'General medical consultation',
                price: 150.00,
                durationMinutes: 30
            }
        }),
        prisma.service.upsert({
            where: { id: 'Cardiology_Consultation' },
            update: {},
            create: {
                name: 'Cardiology Consultation',
                description: 'Specialized cardiology consultation',
                price: 250.00,
                durationMinutes: 45
            }
        }),
        prisma.service.upsert({
            where: { id: 'Dermatology_Consultation' },
            update: {},
            create: {
                name: 'Dermatology Consultation',
                description: 'Skin and dermatology consultation',
                price: 200.00,
                durationMinutes: 40
            }
        }),
        prisma.service.upsert({
            where: { id: 'Blood_Test' },
            update: {},
            create: {
                name: 'Blood Test',
                description: 'Blood collection and analysis',
                price: 80.00,
                durationMinutes: 15
            }
        }),
        prisma.service.upsert({
            where: { id: 'X-Ray' },
            update: {},
            create: {
                name: 'X-Ray',
                description: 'Radiographic examination',
                price: 120.00,
                durationMinutes: 20
            }
        }),
        prisma.service.upsert({
            where: { id: 'Ultrasound' },
            update: {},
            create: {
                name: 'Ultrasound',
                description: 'Ultrasound examination',
                price: 180.00,
                durationMinutes: 30
            }
        })
    ]);

    console.log('Services created:', services.map(s => s.name));

    // 6. Create Appointments with different statuses
    console.log('Creating appointments...');
    
    // Past appointments (completed)
    const pastDate1 = new Date();
    pastDate1.setDate(pastDate1.getDate() - 7);
    pastDate1.setHours(10, 0, 0, 0);

    const pastDate2 = new Date();
    pastDate2.setDate(pastDate2.getDate() - 3);
    pastDate2.setHours(14, 30, 0, 0);

    // Future appointments (scheduled)
    const futureDate1 = new Date();
    futureDate1.setDate(futureDate1.getDate() + 2);
    futureDate1.setHours(9, 0, 0, 0);

    const futureDate2 = new Date();
    futureDate2.setDate(futureDate2.getDate() + 5);
    futureDate2.setHours(11, 0, 0, 0);

    const appointments = await Promise.all([
        // Completed appointments
        prisma.appointment.create({
            data: {
                patientId: patientsCentral[0].id,
                serviceId: services[0].id,
                doctorId: doctorsCentral[0].id,
                scheduledAt: pastDate1,
                status: AppointmentStatus.COMPLETED,
                notes: 'Patient with headache complaints'
            }
        }),
        prisma.appointment.create({
            data: {
                patientId: patientsCentral[1].id,
                serviceId: services[1].id,
                doctorId: doctorsCentral[1].id,
                scheduledAt: pastDate2,
                status: AppointmentStatus.COMPLETED,
                notes: 'Cardiac evaluation'
            }
        }),
        // Scheduled appointments
        prisma.appointment.create({
            data: {
                patientId: patientsCentral[2].id,
                serviceId: services[2].id,
                doctorId: doctorsCentral[0].id,
                scheduledAt: futureDate1,
                status: AppointmentStatus.SCHEDULED,
                notes: 'Skin condition evaluation'
            }
        }),
        prisma.appointment.create({
            data: {
                patientId: patientsNorth[0].id,
                serviceId: services[0].id,
                doctorId: doctorNorth.id,
                scheduledAt: futureDate2,
                status: AppointmentStatus.SCHEDULED,
                notes: 'General checkup'
            }
        }),
        // Cancelled appointment
        prisma.appointment.create({
            data: {
                patientId: patientsCentral[0].id,
                serviceId: services[3].id,
                doctorId: doctorsCentral[1].id,
                scheduledAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                status: AppointmentStatus.CANCELLED,
                notes: 'Patient cancelled due to emergency'
            }
        })
    ]);

    console.log('Appointments created');

    // 7. Create Payments with different statuses
    console.log('Creating payments...');
    const payments = await Promise.all([
        // Completed payment
        prisma.payment.create({
            data: {
                appointmentId: appointments[0].id,
                patientId: patientsCentral[0].id,
                amount: services[0].price,
                method: PaymentMethod.CREDIT_CARD,
                status: PaymentStatus.COMPLETED,
                transactionId: 'TXN_001_COMPLETED',
                paidAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
            }
        }),
        // Completed payment
        prisma.payment.create({
            data: {
                appointmentId: appointments[1].id,
                patientId: patientsCentral[1].id,
                amount: services[1].price,
                method: PaymentMethod.PIX,
                status: PaymentStatus.COMPLETED,
                transactionId: 'TXN_002_COMPLETED',
                paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            }
        }),
        // Pending payment
        prisma.payment.create({
            data: {
                appointmentId: appointments[2].id,
                patientId: patientsCentral[2].id,
                amount: services[2].price,
                method: PaymentMethod.DEBIT_CARD,
                status: PaymentStatus.PENDING
            }
        }),
        // Failed payment
        prisma.payment.create({
            data: {
                appointmentId: appointments[4].id,
                patientId: patientsCentral[0].id,
                amount: services[3].price,
                method: PaymentMethod.CREDIT_CARD,
                status: PaymentStatus.FAILED,
                transactionId: 'TXN_004_FAILED'
            }
        })
    ]);

    console.log('Payments created');

    // 8. Create Invoices for completed payments
    console.log('Creating invoices...');
    const invoices = await Promise.all([
        prisma.invoice.create({
            data: {
                paymentId: payments[0].id,
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                totalAmount: payments[0].amount,
                pdfUrl: '/invoices/INV_001.pdf'
            }
        }),
        prisma.invoice.create({
            data: {
                paymentId: payments[1].id,
                dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                totalAmount: payments[1].amount,
                pdfUrl: '/invoices/INV_002.pdf'
            }
        })
    ]);

    console.log('Invoices created');

    // 9. Create Prescriptions
    console.log('Creating prescriptions...');
    const prescriptions = await Promise.all([
        prisma.prescription.create({
            data: {
                patientId: patientsCentral[0].id,
                doctorId: doctorsCentral[0].id,
                medication: 'Paracetamol',
                dosage: '500mg',
                instructions: 'Take 1 tablet every 6 hours for pain',
                status: PrescriptionStatus.ACTIVE,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        }),
        prisma.prescription.create({
            data: {
                patientId: patientsCentral[0].id,
                doctorId: doctorsCentral[0].id,
                medication: 'Ibuprofen',
                dosage: '400mg',
                instructions: 'Take 1 tablet every 8 hours for inflammation',
                status: PrescriptionStatus.ACTIVE,
                expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            }
        }),
        prisma.prescription.create({
            data: {
                patientId: patientsCentral[1].id,
                doctorId: doctorsCentral[1].id,
                medication: 'Atorvastatin',
                dosage: '20mg',
                instructions: 'Take 1 tablet daily at night',
                status: PrescriptionStatus.ACTIVE,
                expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)
            }
        }),
        prisma.prescription.create({
            data: {
                patientId: patientsNorth[0].id,
                doctorId: doctorNorth.id,
                medication: 'Amoxicillin',
                dosage: '500mg',
                instructions: 'Take 1 tablet every 8 hours for 7 days',
                status: PrescriptionStatus.ACTIVE,
                expiresAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
            }
        })
    ]);

    console.log('Prescriptions created');

    // 10. Create Medical Notes
    console.log('Creating medical notes...');
    const medicalNotes = await Promise.all([
        prisma.medicalNote.create({
            data: {
                patientId: patientsCentral[0].id,
                doctorId: doctorsCentral[0].id,
                content: 'Patient presents migraine symptoms. Recommended rest and prescribed medication. Blood pressure: 120/80 mmHg.'
            }
        }),
        prisma.medicalNote.create({
            data: {
                patientId: patientsCentral[1].id,
                doctorId: doctorsCentral[1].id,
                content: 'Cardiac evaluation completed. ECG shows normal sinus rhythm. Cholesterol levels slightly elevated. Recommended dietary changes and follow-up in 3 months.'
            }
        }),
        prisma.medicalNote.create({
            data: {
                patientId: patientsCentral[2].id,
                doctorId: doctorsCentral[0].id,
                content: 'Initial dermatology consultation. Patient reports skin irritation. Prescribed topical cream and recommended allergy tests.'
            }
        }),
        prisma.medicalNote.create({
            data: {
                patientId: patientsNorth[0].id,
                doctorId: doctorNorth.id,
                content: 'General checkup. Patient in good health. Recommended annual blood tests and maintaining current lifestyle.'
            }
        })
    ]);

    console.log('Medical notes created');

    // 11. Create Telemedicine Sessions
    console.log('Creating telemedicine sessions...');
    const teleSessions = await Promise.all([
        prisma.teleSession.create({
            data: {
                patientId: patientsCentral[0].id,
                doctorId: doctorsCentral[0].id,
                startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
                endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
                sessionUrl: 'https://televisit.centralhospital.com/session/tele001',
                notes: 'Follow-up consultation for migraine treatment',
                recordingUrl: 'https://televisit.centralhospital.com/recordings/tele001'
            }
        }),
        prisma.teleSession.create({
            data: {
                patientId: patientsCentral[1].id,
                doctorId: doctorsCentral[1].id,
                startTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
                endTime: null,
                sessionUrl: 'https://televisit.centralhospital.com/session/tele002',
                notes: 'Scheduled cardiac follow-up'
            }
        }),
        prisma.teleSession.create({
            data: {
                patientId: patientsNorth[0].id,
                doctorId: doctorNorth.id,
                startTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
                endTime: null,
                sessionUrl: 'https://televisit.northmedical.com/session/tele003',
                notes: 'Initial teleconsultation'
            }
        })
    ]);

    console.log('Telemedicine sessions created');

    // 12. Create Audit Logs for testing
    console.log('Creating audit logs...');
    const auditLogs = await Promise.all([
        prisma.auditLog.create({
            data: {
                userId: adminUser.id,
                action: 'USER_LOGIN',
                entity: 'User',
                entityId: adminUser.id,
                metadata: JSON.stringify({
                    ip: '192.168.1.100',
                    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                })
            }
        }),
        prisma.auditLog.create({
            data: {
                userId: doctorsCentral[0].id,
                action: 'APPOINTMENT_CREATE',
                entity: 'Appointment',
                entityId: appointments[0].id,
                metadata: JSON.stringify({
                    patientId: patientsCentral[0].id,
                    service: 'General Consultation'
                })
            }
        }),
        prisma.auditLog.create({
            data: {
                userId: receptionistCentral.id,
                action: 'PATIENT_REGISTER',
                entity: 'Patient',
                entityId: patientsCentral[2].id,
                metadata: JSON.stringify({
                    cpf: patientsCentral[2].cpf,
                    medicalRecordNumber: patientsCentral[2].medicalRecordNumber
                })
            }
        })
    ]);

    console.log('Audit logs created');

    // 13. Print Summary
    console.log('\n🎉 Database seed completed successfully!');
    console.log('=========================================');
    console.log(`🏥 Hospitals: ${hospitals.length}`);
    console.log(`👥 Users: ${await prisma.user.count()}`);
    console.log(`👤 Patients: ${await prisma.patient.count()}`);
    console.log(`📅 Appointments: ${await prisma.appointment.count()}`);
    console.log(`💳 Payments: ${await prisma.payment.count()}`);
    console.log(`📄 Invoices: ${await prisma.invoice.count()}`);
    console.log(`💊 Prescriptions: ${await prisma.prescription.count()}`);
    console.log(`📝 Medical Notes: ${await prisma.medicalNote.count()}`);
    console.log(`📹 TeleSessions: ${await prisma.teleSession.count()}`);
    console.log(`📊 Audit Logs: ${await prisma.auditLog.count()}`);
    console.log('=========================================');
    console.log('\n🔑 Test Credentials:');
    console.log('Admin: admin@centralhospital.com / password123');
    console.log('Doctor: dr.silva@centralhospital.com / password123');
    console.log('Reception: reception@centralhospital.com / password123');
    console.log('Financial: finance@centralhospital.com / password123');
}

main()
    .catch((e) => {
        console.error('❌ Seed error:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });