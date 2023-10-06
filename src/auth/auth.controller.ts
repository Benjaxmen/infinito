import { Controller, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signIn')
  async signIn(@Req() request: any) {
    // Generate a token using the authService
    const token = await this.authService.generateToken(request);
    // Return the generated token as a response
    return { token };
  }
}
