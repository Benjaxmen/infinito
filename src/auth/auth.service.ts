import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import  UserService  from '../services/user.service';
import { JWT_SECRET } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private JwtService: JwtService,
    private userService: UserService,
  ) {}

  async login(request: any) {
    const payload = { username: request.email, password: request.password };
    const result = await this.validateUser(payload)
    if (result){    return {
      access_token: this.JwtService.sign(payload, { secret: JWT_SECRET }),
    }}
    return null;
  }

  async validateUser(payload: any): Promise<any> {
    const user: any = await this.userService.findOne(payload.email);
    if (user && (await this.userService.validatePassword(user.id,payload.password))) {
      const { password, ...result } = user;
      return result;
    }
    return "null";
  }

  async generateToken(user: any) {
    const { password, ...result } = user;
    return this.JwtService.sign(result, { secret: JWT_SECRET });
  }

}
