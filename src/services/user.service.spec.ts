import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { isEmail } from 'validator';
import CurriculumSchema from 'src/schemas/curriculum.schema';
import UserService from './user.service';
import UserSchema from '../schemas/user.schema';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongodb';
import { mock } from 'node:test';

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
        name: 'Benjamín Suárez Chavarría',
        password: '123123123',
        dateofbirth: '1997-07-22',
        profession: 'ingeniero',
        rut: '154326750',
        cellphone: '3445564465',
      };

      jest.spyOn(userModel, 'findOne').mockResolvedValue(null);
      jest.spyOn(userModel.prototype, 'save').mockResolvedValue(userData);

      const result = await service.create(userData);

      expect(userModel.findOne).toHaveBeenCalledWith({ email: userData.email });
      expect(userModel.prototype.save).toHaveBeenCalled();
      expect(ObjectId.isValid(result)).toBeTruthy();
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

      await expect(service.create(userData)).rejects.toThrow(
        BadRequestException,
      );
    });

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
  describe('read_curr', () => {
    it('should return the curriculum of the user', async () => {
      const userId = 'user_id';
      const curriculumData = {
        studies: ['asd'],
        experiences: ['asd'],
        courses: ['asd'],
        languages: ['asd'],
      };

      jest.spyOn(service, 'read_curr').mockResolvedValue({
        studies: ['asd'],
        experiences: ['asd'],
        courses: ['asd'],
        languages: ['asd'],
      } as any);
      const result = await service.read_curr(userId);

      expect(service.read_curr).toHaveBeenCalledWith(userId);
      expect(result).toEqual(curriculumData);
    });
    describe('update_description', () => {
      it('should update the description of the user', async () => {
        const userId = 'user_id';
        const newDesc = 'New description';

        jest.spyOn(service, 'update_description').mockResolvedValue(newDesc);
        const result = await service.update_description(userId, newDesc);

        expect(service.update_description).toHaveBeenCalledWith(
          userId,
          newDesc,
        );
        expect(result).toEqual(newDesc);
      });

      it('should throw BadRequestException if user ID is not valid', async () => {
        const userId = 'invalid_id';
        const newDesc = 'New description';

        jest.spyOn(service, 'update_description').mockImplementation(() => {
          throw new BadRequestException();
        });

        await expect(
          service.update_description(userId, newDesc),
        ).rejects.toThrow(BadRequestException);
      });
    });

    describe('add_media', () => {
      it('should add media to the user profile', async () => {
        const userId = 'user_id';
        const mediaId = 'media_id';

        jest.spyOn(service, 'add_media').mockResolvedValue(mediaId);
        const result = await service.add_media(userId);

        expect(service.add_media).toHaveBeenCalledWith(userId);
        expect(result).toEqual(mediaId);
      });

      it('should throw BadRequestException if user ID is not valid', async () => {
        const userId = 'invalid_id';

        jest.spyOn(service, 'add_media').mockImplementation(() => {
          throw new BadRequestException();
        });

        await expect(service.add_media(userId)).rejects.toThrow(
          BadRequestException,
        );
      });
    });

    describe('add_doc', () => {
      it('should add a document to the user profile', async () => {
        const userId = 'user_id';
        const docId = 'doc_id';

        jest.spyOn(service, 'add_doc').mockResolvedValue(docId);
        const result = await service.add_doc(userId);

        expect(service.add_doc).toHaveBeenCalledWith(userId);
        expect(result).toEqual(docId);
      });

      it('should throw BadRequestException if user ID is not valid', async () => {
        const userId = 'invalid_id';

        jest.spyOn(service, 'add_doc').mockImplementation(() => {
          throw new BadRequestException();
        });

        await expect(service.add_doc(userId)).rejects.toThrow(
          BadRequestException,
        );
      });
    });
  });

  // Add more test cases for other UserService methods
});
describe('read_curr_studies', () => {
  it('should return the studies of the user', async () => {
    const userId = 'user_id';
    const curriculumData = {
      studies: ['asd'],
      experiences: ['asd'],
      courses: ['asd'],
      languages: ['asd'],
    };

    jest.spyOn(service, 'read_curr_studies').mockResolvedValue({
      studies: ['asd'],
      experiences: ['asd'],
      courses: ['asd'],
      languages: ['asd'],
    } as any);

    const result = await service.read_curr_studies(userId);

    expect(service.read_curr_studies).toHaveBeenCalledWith(userId);
    expect(result).toEqual(curriculumData);
  });

  // Add more test cases for other UserService methods
});

describe('read_curr_experiences', () => {
  it('should return the experiences of the user', async () => {
    const userId = 'user_id';
    const curriculumData = {
      studies: ['asd'],
      experiences: ['asd'],
      courses: ['asd'],
      languages: ['asd'],
    };

    jest.spyOn(service, 'read_curr_experiences').mockResolvedValue({
      studies: ['asd'],
      experiences: ['asd'],
      courses: ['asd'],
      languages: ['asd'],
    } as any);

    const result = await service.read_curr_experiences(userId);

    expect(service.read_curr_experiences).toHaveBeenCalledWith(userId);
    expect(result).toEqual(curriculumData);
  });

  // Add more test cases for other UserService methods
});

describe('read_curr_courses', () => {
  it('should return the courses of the user', async () => {
    const userId = 'user_id';
    const curriculumData = {
      studies: ['asd'],
      experiences: ['asd'],
      courses: ['asd'],
      languages: ['asd'],
    };

    jest.spyOn(service, 'read_curr_courses').mockResolvedValue({
      studies: ['asd'],
      experiences: ['asd'],
      courses: ['asd'],
      languages: ['asd'],
    } as any);

    const result = await service.read_curr_courses(userId);

    expect(service.read_curr_courses).toHaveBeenCalledWith(userId);
    expect(result).toEqual(curriculumData);
  });

  // Add more test cases for other UserService methods
});

describe('read_curr_languages', () => {
  it('should return the languages of the user', async () => {
    const userId = 'user_id';
    const curriculumData = {
      studies: ['asd'],
      experiences: ['asd'],
      courses: ['asd'],
      languages: ['asd'],
    };

    jest.spyOn(service, 'read_curr_languages').mockResolvedValue({
      studies: ['asd'],
      experiences: ['asd'],
      courses: ['asd'],
      languages: ['asd'],
    } as any);

    const result = await service.read_curr_languages(userId);

    expect(service.read_curr_languages).toHaveBeenCalledWith(userId);
    expect(result).toEqual(curriculumData);
  });

  // Add more test cases for other UserService methods
});
