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
    const payload2={email: user._doc.email, name: user._doc.name,rol:user._doc.rol,dob:user._doc.dateofbirth,profession:user._doc.profession,rut:user._doc.rut,cellphone:user._doc.cellphone}
    if (user) {
      const token= await this.JwtService.signAsync(payload2, { secret: JWT_SECRET })
      return {
        access_token: token ,
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
