import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '../services/user.service';
import { JWT_SECRET } from './constants';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload, { secret: JWT_SECRET }),
    };
  }

  async validateUser(payload: any): Promise<any> {
    const user = await this.usersService.findOne(payload.username);
    if (user && user.validatePassword(payload.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async generateToken(user: any) {
    const { password, ...result } = user;
    return this.jwtService.sign(result, { secret: JWT_SECRET });
  }
}
