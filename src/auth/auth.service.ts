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
    const payload = { email: request.email, password: request.password };
    const user = await this.validateUser(payload);
    if (user) {
      return {
        access_token: this.JwtService.sign({name: user.name, email: user.email,rol: user.rol }, { secret: JWT_SECRET }),
      };
    }
    return null;
  }
  

  async validateUser(payload: any): Promise<any> {
    const user= await this.userService.findOne({email:payload.email});
    if (user && (await this.userService.validatePassword(user.id,payload.password))) {
      const { password, ...result } = user;
      return result;
    }
    return false;
  }
}
