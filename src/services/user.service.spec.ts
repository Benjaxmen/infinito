// Import necessary modules and schemas
import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import UserService from './user.service';
import UserSchema from '../schemas/user.schema';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

// Test suite for UserService
describe('UserService', () => {
  let service: UserService;
  let userModel: any;

  // Setup for each test
  beforeEach(async () => {
    // Create a testing module with UserService as a provider
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    // Get an instance of UserService and a model of User
    service = module.get<UserService>(UserService);
    userModel = mongoose.model('User', UserSchema);
  });

  // Test suite for 'create' method
  describe('create', () => {
    it('should create a new user if email is valid and not repeated', async () => {
      // Define a user data object for testing
      const userData = {
        email: 'test2@example.com',
        name: 'Benjamín Suárez Chavarría',
        password: '123123123',
        dateofbirth: '1997-07-22',
        profession: 'ingeniero',
        rut: '154326750',
        cellphone: '3445564465',
      };

      // Mock the 'findOne' and 'save' methods of userModel
      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(userModel.prototype, 'save').mockResolvedValue(userData);

      // Call the 'create' method with the test user data
      const result = await service.create(userData);

      // Assert that 'findOne' was called with the correct email
      expect(userModel.findOne).toHaveBeenCalledWith({ email: userData.email });
      // Assert that 'save' was called
      expect(userModel.prototype.save).toHaveBeenCalled();
      // Assert that the result is a valid ObjectId
      expect(ObjectId.isValid(result)).toBeTruthy();
    });
    it('should throw BadRequestException if email is already associated with an account', async () => {
      // Define a user data object for testing
      const userData = {
        email: 'test2@example.com',
        name: 'Benjamín Suárez Chavarría',
        password: '123123123',
        dateofbirth: '1997-07-22',
        profession: 'ingeniero',
        rut: '154326750',
        cellphone: '3445564465',
      };

      // Mock the 'findOne' method of userModel to return the test user data
      jest.spyOn(userModel, 'findOne').mockResolvedValue(userData);

      // Assert that calling 'create' with the test user data throws a BadRequestException
      await expect(service.create(userData)).rejects.toThrow(
        BadRequestException,
      );
    });

    // Test case: Exception thrown when email is not valid
    it('should throw BadRequestException if email is not valid', async () => {
      const userData = {
        email: 'invalidemail',
        name: 'Benjamín Suárez Chavarría',
        password: '123123123',
        dateofbirth: '1997-07-22',
        profession: 'ingeniero',
        rut: '154326750',
        cellphone: '3445564465',
      };

      await expect(service.create(userData)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
  it('should throw BadRequestException if email is already associated with an account', async () => {
    const userData = {
      email: 'test2@example.com',
      name: 'Benjamín Suárez Chavarría',
      password: '123123123',
      dateofbirth: '1997-07-22',
      profession: 'ingeniero',
      rut: '154326750',
      cellphone: '3445564465',
    };

    jest.spyOn(userModel, 'findOne').mockResolvedValue(userData);

    await expect(service.create(userData)).rejects.toThrow(BadRequestException);
  });

  it('should throw BadRequestException if user registry is not complete', async () => {
    const userData = {
      email: 'test2@example.com',
      name: 'Benjamín Suárez Chavarría',
      password: '123123123',
      dateofbirth: '1997-07-22',
      profession: 'ingeniero',
      rut: '154326750',
      // missing field: cellphone
    };

    await expect(service.create(userData)).rejects.toThrow(BadRequestException);
  });

  // Add more test cases for other UserService methods

  // Add more test cases for other UserService methods
});
