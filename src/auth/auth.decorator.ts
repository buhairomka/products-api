import {applyDecorators, UseGuards} from '@nestjs/common';
import {ApiBearerAuth, ApiHeader, ApiUnauthorizedResponse,} from '@nestjs/swagger';
import {AuthGuard} from "./auth.guard";


export function Auth() {
    return applyDecorators(
        UseGuards(AuthGuard),
        ApiBearerAuth('jwt'),
        ApiHeader({name: 'Token', required: true, style: 'form'}),
        ApiUnauthorizedResponse({
            description: 'Unauthorized',
            schema: {example: {statusCode: 401, message: 'Unauthorized'}}
        })
    );
}
