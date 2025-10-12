// test/auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('AuthController (e2e)', () => {
    let app: INestApplication;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    it('/auth/register (POST) - should register user', () => {
        return request(app.getHttpServer())
            .post('/auth/register')
            .send({
                email: 'test@example.com',
                fullName: 'Test User',
                password: 'password123',
                roleId: 'YOUR_ROLE_ID_HERE', // ID de uma role existente
                phone: '+5511999999999'
            })
            .expect(201)
            .expect(res => {
                expect(res.body).toHaveProperty('access_token');
            });
    });

    it('/auth/login (POST) - should login user', () => {
        return request(app.getHttpServer())
            .post('/auth/login')
            .send({
                email: 'test@example.com',
                password: 'password123'
            })
            .expect(200)
            .expect(res => {
                expect(res.body).toHaveProperty('access_token');
            });
    });
});