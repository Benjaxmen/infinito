import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { JwtAuthGuard } from '@nestjs/passport'; // Import JwtAuthGuard
import UserService from '../services/user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() userData) {
    return this.userService.create(userData);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard) // Add JwtAuthGuard as a parameter to the read method decorator
  async read(@Param('id') userId) {
    // Add condition to check if 'rol' field in JWT payload is equal to 'Admin'
    const user = await this.userService.read(userId);
    if (user.rol !== 'Admin') {
      return { message: 'Access denied' };
    }
    return user;
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
