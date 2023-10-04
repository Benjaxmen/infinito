import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { isEmail } from 'validator';
import UserService from './user.service';
import UserSchema from '../schemas/user.schema';
import * as mongoose from 'mongoose';

describe('UserService', () => {
  let service: UserService;
  let userModel: any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
    userModel = mongoose.model('User', UserSchema);
  });

  describe('create', () => {
    it('should create a new user if email is valid and not repeated', async () => {
      const userData = {
        email: 'test2@example.com',
        name: "Benjamín Suárez Chavarría",
        password: "123123123",
        dateofbirth: "1997-07-22",
        profession: "ingeniero",
        rut: "154326750",
        cellphone: "3445564465"
      };
    
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(userModel.prototype, 'save').mockResolvedValue(userData);
    
      const result = await service.create(userData);
    
      expect(userModel.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(userModel.prototype.save).toHaveBeenCalled();
      expect(result).toEqual(user.id);
    });

    it('should throw BadRequestException if email is already associated with an account', async () => {
      const userData = {
        email: 'test2@example.com',
        name: "Benjamín Suárez Chavarría",
        password: "123123123",
        dateofbirth: "1997-07-22",
        profession: "ingeniero",
        rut: "154326750",
        cellphone: "3445564465"
      };

      jest.spyOn(userModel, 'findOne').mockResolvedValue(userData);

      await expect(service.create(userData)).rejects.toThrow(BadRequestException);
    });

    it('should throw BadRequestException if email is not valid', async () => {
      const userData = {
        email: 'invalidemail',
        name: "Benjamín Suárez Chavarría",
        password: "123123123",
        dateofbirth: "1997-07-22",
        profession: "ingeniero",
        rut: "154326750",
        cellphone: "3445564465"
      };

      await expect(service.create(userData)).rejects.toThrow(BadRequestException);
    });
  });
  it('should throw BadRequestException if email is already associated with an account', async () => {
    const userData = {
      email: 'test2@example.com',
      name: "Benjamín Suárez Chavarría",
      password: "123123123",
      dateofbirth: "1997-07-22",
      profession: "ingeniero",
      rut: "154326750",
      cellphone: "3445564465"
    };

    jest.spyOn(userModel, 'findOne').mockResolvedValue(userData);

    await expect(service.create(userData)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if email is not valid', async () => {
    const userData = {
      email: 'invalidemail',
      name: "Benjamín Suárez Chavarría",
      password: "123123123",
      dateofbirth: "1997-07-22",
      profession: "ingeniero",
      rut: "154326750",
      cellphone: "3445564465"
    };

    await expect(service.create(userData)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if user registry is not complete', async () => {
    const userData = {
      email: 'test2@example.com',
      name: "Benjamín Suárez Chavarría",
      password: "123123123",
      dateofbirth: "1997-07-22",
      profession: "ingeniero",
      rut: "154326750",
      // missing field: cellphone
    };

    await expect(service.create(userData)).rejects.toThrow(BadRequestException);
  });

  // Add more test cases for other UserService methods

});
