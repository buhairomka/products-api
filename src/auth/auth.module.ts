import {Module} from '@nestjs/common';
import {AuthService} from './auth.service';
import {JwtModule, JwtService} from "@nestjs/jwt";
import {AuthController} from './auth.controller';
import {AuthGuard} from "./auth.guard";
import {ConfigModule, ConfigService} from "@nestjs/config";

@Module({
    imports: [
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get('JWT_SECRET'),
                signOptions: {expiresIn: '5m',},
                verifyOptions: {ignoreExpiration: false}
            }),
            inject: [ConfigService]
        })
    ],
    providers: [AuthService, JwtService, AuthGuard],
    exports: [AuthService, JwtService],
    controllers: [AuthController],
})
export class AuthModule {
}