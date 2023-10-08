import * as mongoose from 'mongoose';
import UserSchema from '../schemas/user.schema';
import { BadRequestException } from '@nestjs/common';
import { isEmail } from 'validator';
import * as bcrypt from 'bcrypt';


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
    userData.password =await this.hashPassword(userData.password)

    const user = new this.userModel(userData);
    await user.save();
    return user.id;
  }
  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Number of salt rounds (higher is more secure but slower)

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }
  async validatePassword(userId,password: string){
    const user=await this.userModel.findOne({_id: userId});
    const result=await bcrypt.compare(password,user.password);
    return result;

  }

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }

  async findOne(userId) {
    const user = await this.userModel.findOne({_id: userId});
    return user;
  }

  async read(userId) {
    const user = await this.userModel.find({_id: userId});
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
