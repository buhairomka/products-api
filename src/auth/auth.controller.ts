import {Controller, Get, Post} from '@nestjs/common';
import { AuthService } from './auth.service';
import {ApiOkResponse, ApiTags} from "@nestjs/swagger";
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('token')
  @ApiOkResponse({description:'Token received',schema:{example:{
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dWlkIjoiNGFhYzEyYWEtZmYxZi00OGRmLWJhNmUtOWUzMWQ4M2NjMjg0IiwiaWF0IjoxNzE5NDk4OTI3NTkxLCJleHAiOjE3MTk0OTkyMjd9.WXnprJp1ZVgIGIC7jfADX9Av2AS2AdA1PhBmrwnkE7E",
        "exp": 1719499227
      }}})
  async getToken(): Promise<{ token: string , exp: number}> {
    const {token,exp} = await this.authService.createToken();
    return { token,exp};
  }
}
