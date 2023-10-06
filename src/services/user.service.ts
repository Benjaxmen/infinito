import * as mongoose from 'mongoose';
import UserSchema from '../schemas/user.schema';
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
    if(!userData.name || !userData.password || !userData.dateofbirth || !userData.profession || !userData.rut || !userData.cellphone){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Ingresa datos válidos' })
    }

    const user = new this.userModel(userData);
    await user.save();
    return user.id;
  }

  async findAll() {
    const users = await this.userModel.find();
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
