import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import UserService from '../services/user.service';
import { JwtStrategy } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtStrategy: JwtStrategy,
  ) {}

  @Post()
  async create(@Body() userData) {
    return this.userService.create(userData);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async read(@Param('id') userId) {
    async validateToken(userId) {
        // Validate JWT and check 'rol' parameter
        const user = await this.authService.validateUser(userId);
        if (!user || user.rol !== 'Admin') {
            throw new UnauthorizedException();
        }
        // Return result
        return user;
    }
    return this.userService.update(userId, newUserData);
  }

  @Delete(':id')
  async delete(@Param('id') userId) {
    return this.userService.delete(userId);
  }
}
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async read(@Param('id') userId) {
    return this.userService.read(userId);
  }

  @Put(':id')
  async update(@Param('id') userId, @Body() newUserData) {
    return this.userService.update(userId, newUserData);
  }

  @Delete(':id')
  async delete(@Param('id') userId) {
    return this.userService.delete(userId);
  }
}
