import * as mongoose from 'mongoose';
import UserSchema from '../schemas/user.schema';
import { BadRequestException } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { isEmail } from 'validator';

class UserService {
  private userModel = mongoose.model('User', UserSchema);

  async create(userData) {
      const existingUser = await this.userModel.findOne({ email: userData.email });
      if (existingUser) {
        throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Ese correo electrónico ya está asociado a una cuenta' })
      }
      if(!isEmail(userData.email)){
        throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Ingresa un correo electrónico válido' })
      }
    
      if (Object.values(userData).some(value => !value)) {
        throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Todos los campos son requeridos' });
      }
    
      const user = new this.userModel({
        ...userData,
        dateOfRegistry: Date.now(),
        rol: 'Usuario',
      });
      await user.save();
      return user;
    }
    return users;
  }

  async findOne(userId) {
    const user = await this.userModel.findById(userId);
    return user;
  }

  async read(userId) {
    const user = await this.userModel.findOne(userId);
    return user;
  }

  async update(userId, newUserData) {
    const user = await this.userModel.findByIdAndUpdate(userId, newUserData, { new: true });
    return user;
  }

  async delete(userId) {
    const user = await this.userModel.findByIdAndDelete(userId);
    return user;
  }
}

export default UserService;
