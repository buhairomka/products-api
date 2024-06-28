import {CanActivate, ExecutionContext, Injectable, Logger, UnauthorizedException} from "@nestjs/common";
import {JwtService} from '@nestjs/jwt';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService,
                readonly config:ConfigService) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = request.headers.token;
        Logger.debug(token);
        if (!token) {
            throw new UnauthorizedException();
        }
        try {
            await this.jwtService.verifyAsync(
                token,
                {
                    secret: this.config.get('JWT_SECRET')
                }
            );
        } catch {
            throw new UnauthorizedException();
        }
        return true;
    }
}