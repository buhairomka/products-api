import {Injectable} from '@nestjs/common';
import {JwtService} from '@nestjs/jwt';
import {randomUUID} from "node:crypto";
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly config: ConfigService
    ) {
    }

    async createToken(): Promise<{ token: string, exp: number }> {
        const payload = {
            uuid: randomUUID(),
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 60 * 5 // Токен дійсний 5 хв
        };

        return {
            token: this.jwtService.sign(payload, {secret: this.config.get('JWT_SECRET'),/* jwtid:payload.uuid*/}),
            exp: payload.exp
        }
    }
}
