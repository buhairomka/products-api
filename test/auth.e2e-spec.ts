import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import * as jwtDecode from 'jwt-decode';
import { validate as uuidValidate } from 'uuid';
import {AppModule} from "../src/app.module";
import {AuthService} from "../src/auth/auth.service";
import {JwtService} from "@nestjs/jwt";

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

    it('/GET auth/token', async () => {
        const response = await request(app.getHttpServer())
            .get('/auth/token')
            .expect(200);

        const { token, exp } = response.body;
        expect(token).toBeDefined();
        expect(exp).toBeDefined();

        // Розкодування токена
        const decoded: any = jwtDecode.jwtDecode(token);

        // Перевірка структури токена
        expect(decoded).toHaveProperty('uuid');
        expect(decoded).toHaveProperty('iat');
        expect(decoded).toHaveProperty('exp');

        // Перевірка валідності UUID
        expect(uuidValidate(decoded.uuid)).toBe(true);

        // Перевірка різниці в часі
        const currentTime = Math.floor(Date.now() / 1000);
        expect(decoded.iat).toBeLessThanOrEqual(currentTime);
        expect(decoded.exp - decoded.iat).toBe(300); // 5 хвилин у секундах

        // Перевірка відповідності exp з відповіді та в токені
        expect(decoded.exp).toBe(exp);
    });
});