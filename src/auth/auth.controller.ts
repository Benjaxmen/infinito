import { Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('login')
  async login(@Req() request: any) {
    
    const token = await this.authService.login(request);
    // Return the access_token as a response with the key 'token'
    return token;
  }
}
