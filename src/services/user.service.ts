import * as mongoose from 'mongoose';
import UserSchema from '../schemas/user.schema';

class UserService {
  private userModel = mongoose.model('User', UserSchema);

  import * as mongoose from 'mongoose';
  import UserSchema from '../schemas/user.schema';
  
  class UserService {
    private userModel = mongoose.model('User', UserSchema);
  
    async create(userData) {
      const existingUser = await this.userModel.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('Email is already associated with another user');
      }
  
      const user = new this.userModel(userData);
      await user.save();
      return user;
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
