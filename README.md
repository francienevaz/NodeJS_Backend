<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# 🏥 Hospital Management System

A hospital management system developed with a modular architecture based on DDD (Domain-Driven Design) and Node.js design patterns.

---

## 🏗️ Architecture and Patterns

### Architecture: Modular Monolith
- Modular structure by business domains  
- Clear separation of responsibilities  
- Low coupling between modules  
- High cohesion within modules  

### DDD (Domain-Driven Design)
- Domain-oriented modeling focused on healthcare  
- Entities, Value Objects, and Aggregates  
- Ubiquitous language across domains  
- Well-defined Bounded Contexts  

### Node.js Design Patterns
- Dependency Injection  
- Repository Pattern  
- Service Layer  
- Factory Pattern  
- Strategy Pattern  

---

## Technologies Used

### Backend
- **NestJS** – Modular Node.js framework  
- **TypeScript** – Typed superset of JavaScript  
- **Prisma** – Type-safe ORM  
- **PostgreSQL** – Relational database  
- **JWT** – Token-based authentication  
- **bcrypt** – Password hashing  
- **class-validator** – DTO validation  
- **class-transformer** – Object transformation  

### Infrastructure
- **Docker** – Containerization  
- **Docker Compose** – Container orchestration  
- **PostgreSQL** – Database  

---

## System Domains

### Core Domains
- **Auth** – Authentication and authorization  
- **Users** – User and role management  
- **Patients** – Patient registration and management  
- **Appointments** – Scheduling of consultations  

### Supporting Domains
- **Clinical** – Medical records and prescriptions  
- **Finance** – Payments and invoices  
- **Telemedicine** – Remote consultations  

### Generic Domains
- **Audit** – Logs and audit trails  
- **Hospital** – Multi-tenancy management  

---

## Project Initialization

### Prerequisites
- Node.js 18+  
- Docker & Docker Compose  
- npm or yarn  

### 1. Clone and Install Dependencies
```bash
git clone <your-repo>
cd hospital-management
npm install
```

### 2. Configure Environment Variables
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/hospital_db"
JWT_SECRET=""
PORT=3000
```

### 3. Start Infrastructure with Docker
```bash
# Start PostgreSQL
docker-compose up -d

# Check containers
docker-compose ps

# Stop containers
docker-compose down
```

### 4. Database Setup
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed database
npx prisma db seed

# Open Prisma Studio
npx prisma studio
```

### 5. Development
```bash
# Hot-reload development
npm run start:dev

# Production build
npm run build

# Start production
npm run start:prod

# Lint
npm run lint

# Tests
npm run test
npm run test:e2e
```

---

## Project Structure
```text
src/
├── auth/                    # Authentication domain
│   ├── dto/                # Data Transfer Objects
│   ├── controllers/        # HTTP controllers
│   ├── services/           # Business logic
│   └── strategies/         # Auth strategies (JWT, etc.)
├── users/                  # User domain
│   ├── entities/           # Domain entities
│   ├── repositories/       # Repository pattern
│   └── services/           # Domain services
├── patients/               # Patient domain
├── appointments/           # Appointment domain
├── clinical/               # Clinical domain
├── finance/                # Financial domain
├── shared/                 # Shared resources
│   ├── common/             # Decorators, filters, etc.
│   └── infrastructure/     # Configs, database
└── main.ts                 # Entry point
```

---

## Prisma Commands
```bash
# Migration development
npx prisma migrate dev --name migration_name

# Deploy migrations (production)
npx prisma migrate deploy

# Reset database (careful!)
npx prisma migrate reset

# Generate Prisma client
npx prisma generate

# Browse data
npx prisma studio

# Run seed
npx prisma db seed
```

---

## Testing the Application

### Test Authentication
```bash
# Register user
curl -X POST http://localhost:3000/api/auth/register   -H "Content-Type: application/json"   -d '{
    "email": "doctor@hospital.com",
    "fullName": "Dr. John Smith",
    "password": "password123",
    "roleId": "role-professional"
  }'

# Login
curl -X POST http://localhost:3000/api/auth/login   -H "Content-Type: application/json"   -d '{
    "email": "doctor@hospital.com",
    "password": "password123"
  }'
```

### Seed Credentials
- **Admin:** admin@hospital.com / password123  
- **Doctor:** dr.smith@hospital.com / password123  

---

## Roles and Permissions
| Role | Description | Permissions |
|------|--------------|--------------|
| ADMIN | Administrator | Full system access |
| PROFESSIONAL | Doctor/Professional | Manage patients, appointments, prescriptions |
| RECEPTIONIST | Receptionist | Scheduling, patient registration |
| FINANCIAL | Financial | Payments, invoices, reports |

---

## Data Model

### Main Entities
- **User:** System users with roles  
- **Patient:** Patients with medical history  
- **Appointment:** Consultation scheduling  
- **Service:** Medical services and pricing  
- **Payment:** Payment processing  
- **Prescription:** Medical prescriptions  

### Key Relationships
- User ↔ Role (M:1)  
- Patient ↔ Appointment (1:M)  
- Appointment ↔ Payment (1:1)  
- User ↔ Patient (M:M via Appointment)  

---

## Security
- JWT authentication  
- Password hashing with bcrypt  
- Data validation with class-validator  
- CORS configured  
- Rate limiting (to be implemented)  

---

## Next Steps

### Planned Improvements
- Redis caching  
- BullMQ for async jobs  
- File uploads (exams, images)  
- Real-time notifications  
- API Documentation (Swagger)  
- Monitoring and logging  
- Integration and unit tests  

### Domain Expansion
- Telemedicine (video calls)  
- Pharmacy and inventory management  
- Lab reports and diagnostics  
- Analytical reports  

---

## 🤝 Contribution
- Follow established coding standards  
- Maintain DDD and modular architecture  
- Add tests for new features  
- Document significant changes  

---

## 📝 License
This project is for educational and portfolio purposes.

Developed with 💊 for efficient hospital management.