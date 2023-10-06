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

  async login(user: any) {
    const payload = { username: user.email, password: user.password };
    const user = await this.validateUser(payload);
    if (user && user.validatePassword(payload.password)) {
      return {
        access_token: this.JwtService.sign(payload, { secret: JWT_SECRET }),
      };
    }
  }
    const user: any = await this.userService.findOne(payload.email);
    if (user && (await user.validatePassword(payload.password))) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async generateToken(user: any) {
    const { password, ...result } = user;
    return this.JwtService.sign(result, { secret: JWT_SECRET });
  }

}
