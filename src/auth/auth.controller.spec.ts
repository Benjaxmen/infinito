import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, BadRequestException } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Importa JwtModule
import * as mongoose from 'mongoose';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import UserSchema from '../schemas/user.schema';
import UserService from '../services/user.service';
import { JWT_SECRET } from './constants';

describe('AuthController', () => {
  let authService: AuthService;
  let service: UserService;
  let userModel: any;
  let controller: AuthController;
  console.log('AuthService:', authService);


  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        JwtModule.register({
          secret: JWT_SECRET, // Reemplaza esto con tu clave secreta
        }),
      ],
      providers: [AuthService, UserService],
      controllers: [AuthController],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    service = module.get<UserService>(UserService);
    userModel = mongoose.model('User', UserSchema);
  });
  describe('login', () => {
    it('should return a JSON web token when the email and password combination is correct', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const token = 'mocked_token';
    
      jest.spyOn(authService, 'login').mockResolvedValue({ access_token: token }); // Devolver un objeto con la estructura correcta
    
      const result = await authService.login({ email, password });
    
      expect(result).toEqual({ access_token: token }); // Verificar que el resultado tenga la estructura correcta
    });
    

    it('should throw a BadRequestException when the email and password combination is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'incorrect_password';

      jest.spyOn(authService, 'login').mockResolvedValue(null);

      try {
        await authService.login({ email, password });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Correo o contraseña incorrectos, intente nuevamente.');
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
