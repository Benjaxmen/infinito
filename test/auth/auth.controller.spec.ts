import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, BadRequestException } from '@nestjs/common';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('login', () => {
    it('should return a JSON web token when the email and password combination is correct', async () => {
      const email = 'test@example.com';
      const password = 'password';
      const token = 'mocked_token';

      jest.spyOn(authService, 'login').mockResolvedValue(token);

      const result = await controller.login({ email, password });

      expect(result).toEqual(token);
    });

    it('should throw a BadRequestException when the email and password combination is incorrect', async () => {
      const email = 'test@example.com';
      const password = 'incorrect_password';

      jest.spyOn(authService, 'login').mockResolvedValue(null);

      try {
        await controller.login({ email, password });
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('Correo o contraseña incorrectos, intente nuevamente.');
        expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST);
      }
    });
  });
});
