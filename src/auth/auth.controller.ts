import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { BadRequestException } from '@nestjs/common';
import { isEmail } from 'validator';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async login(@Body() request: any) {
    const email =request.email;
    const password = request.password;
    if (!isEmail(email) || !password) {
      throw new BadRequestException('Por favor, proporciona un correo electrónico y una contraseña válidos.');
    }
    const payload = { email, password };
    const token = await this.authService.login(payload);
    if(!token){
      throw new BadRequestException('Correo o contraseña incorrectos, intente nuevamente.')
    }
    // Return the access_token as a response with the key 'token'
    return token;
  }
}
