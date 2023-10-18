import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt'; // Added import statement for JwtService
import  UserService  from '../services/user.service'; // Added import statement for UserService
import { JWT_SECRET } from './constants';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    JwtModule.register({
      secret: JWT_SECRET,
      signOptions: { expiresIn: '12h' }
    }),
    PassportModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtService, UserService, JwtStrategy] // Added JwtService and UserService to the providers array
})
export class AuthModule {}
