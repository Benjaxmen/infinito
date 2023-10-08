import { AuthService } from './auth.service';
import { Controller, Post, Body, BadRequestException } from '@nestjs/common';
import { isEmail } from 'validator';
import { UserService } from '../services/user.service';
import { BcryptService } from '../services/bcrypt.service';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private bcryptService: BcryptService,
  ) {}

  @Post('login')
  async login(@Body() request: any) {
    if (!isEmail(request.email) || !request.password) {
      import { AuthService } from './auth.service';
      import {
        Controller,
        Post,
        Body,
        BadRequestException,
      } from '@nestjs/common';
      import { isEmail } from 'validator';
      import { UserService } from '../services/user.service';
      import { BcryptService } from '../services/bcrypt.service';

      @Controller('auth')
      export class AuthController {
        constructor(
          private authService: AuthService,
          private userService: UserService,
          private bcryptService: BcryptService,
        ) {}

        @Post('login')
        async login(@Body() request: any) {
          if (!isEmail(request.email) || !request.password) {
            throw new BadRequestException(
              'Please provide a valid email and password.',
            );
          }
          const user = await this.userService.findByEmail(request.email);
          if (
            !user ||
            !this.bcryptService.compare(request.password, user.password)
          ) {
            throw new BadRequestException(
              'Incorrect email or password, please try again.',
            );
          }
          const payload = { email: request.email, password: request.password };
          const token = await this.authService.login(payload);
          if (!token) {
            throw new BadRequestException(
              'Incorrect email or password, please try again.',
            );
          }
          // Return the access_token as a response with the key 'token'
          return token;
        }
      }
    }
    const payload = { email: request.email, password: request.password };
    const token = await this.authService.login(payload);
    if (!token) {
      throw new BadRequestException(
        'Incorrect email or password, please try again.',
      );
    }
    // Return the access_token as a response with the key 'token'
    return token;
  }
}
