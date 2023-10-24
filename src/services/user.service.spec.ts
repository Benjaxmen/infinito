import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { isEmail } from 'validator';
import UserService from './user.service';
import UserSchema from '../schemas/user.schema';
import * as mongoose from 'mongoose';
import { ObjectId } from 'mongodb';

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

  describe('read_curr', () => {
    it('should return the curriculum of the user', async () => {
      const userId = 'user_id';
      const curriculumData = {
        studies: [],
        experiences: [],
        courses: [],
        languages: [],
      };

      jest.spyOn(service, 'read_curr').mockResolvedValue(curriculumData);

      const result = await service.read_curr(userId);

      expect(service.read_curr).toHaveBeenCalledWith(userId);
      expect(result).toEqual(curriculumData);
    });

    // Add more test cases for other UserService methods
  });

  describe('read_curr_studies', () => {
    it('should return the studies of the user', async () => {
      const userId = 'user_id';
      const curriculumData = {
        studies: [],
      };

      jest
        .spyOn(service, 'read_curr_studies')
        .mockResolvedValue(curriculumData);

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
        experiences: [],
      };

      jest
        .spyOn(service, 'read_curr_experiences')
        .mockResolvedValue(curriculumData);

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
        courses: [],
      };

      jest
        .spyOn(service, 'read_curr_courses')
        .mockResolvedValue(curriculumData);

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
        languages: [],
      };

      jest
        .spyOn(service, 'read_curr_languages')
        .mockResolvedValue(curriculumData);

      const result = await service.read_curr_languages(userId);

      expect(service.read_curr_languages).toHaveBeenCalledWith(userId);
      expect(result).toEqual(curriculumData);
    });

    // Add more test cases for other UserService methods
  });

  describe('add_new_study', () => {
    it('should add a new study to the user curriculum', async () => {
      const userId = 'user_id';
      const newCurriculumData = {
        studies: [],
      };

      jest.spyOn(service, 'add_new_study').mockResolvedValue(newCurriculumData);

      const result = await service.add_new_study(userId, newCurriculumData);

      expect(service.add_new_study).toHaveBeenCalledWith(
        userId,
        newCurriculumData,
      );
      expect(result).toEqual(newCurriculumData);
    });

    // Add more test cases for other UserService methods
  });

  describe('add_new_experience', () => {
    it('should add a new experience to the user curriculum', async () => {
      const userId = 'user_id';
      const newCurriculumData = {
        experiences: [],
      };

      jest
        .spyOn(service, 'add_new_experience')
        .mockResolvedValue(newCurriculumData);

      const result = await service.add_new_experience(
        userId,
        newCurriculumData,
      );

      expect(service.add_new_experience).toHaveBeenCalledWith(
        userId,
        newCurriculumData,
      );
      expect(result).toEqual(newCurriculumData);
    });

    // Add more test cases for other UserService methods
  });

  describe('add_new_course', () => {
    it('should add a new course to the user curriculum', async () => {
      const userId = 'user_id';
      const newCurriculumData = {
        courses: [],
      };

      jest
        .spyOn(service, 'add_new_course')
        .mockResolvedValue(newCurriculumData);

      const result = await service.add_new_course(userId, newCurriculumData);

      expect(service.add_new_course).toHaveBeenCalledWith(
        userId,
        newCurriculumData,
      );
      expect(result).toEqual(newCurriculumData);
    });

    // Add more test cases for other UserService methods
  });

  describe('add_new_language', () => {
    it('should add a new language to the user curriculum', async () => {
      const userId = 'user_id';
      const newCurriculumData = {
        languages: [],
      };

      jest
        .spyOn(service, 'add_new_language')
        .mockResolvedValue(newCurriculumData);

      const result = await service.add_new_language(userId, newCurriculumData);

      expect(service.add_new_language).toHaveBeenCalledWith(
        userId,
        newCurriculumData,
      );
      expect(result).toEqual(newCurriculumData);
    });

    // Add more test cases for other UserService methods
  });

  describe('update_study', () => {
    it('should update a study in the user curriculum', async () => {
      const userId = 'user_id';
      const studyIndex = 0;
      const newStudyData = {};

      jest.spyOn(service, 'update_study').mockResolvedValue(newStudyData);

      const result = await service.update_study(
        userId,
        studyIndex,
        newStudyData,
      );

      expect(service.update_study).toHaveBeenCalledWith(
        userId,
        studyIndex,
        newStudyData,
      );
      expect(result).toEqual(newStudyData);
    });

    // Add more test cases for other UserService methods
  });

  describe('update_experience', () => {
    it('should update an experience in the user curriculum', async () => {
      const userId = 'user_id';
      const experienceIndex = 0;
      const newExperienceData = {};

      jest
        .spyOn(service, 'update_experience')
        .mockResolvedValue(newExperienceData);

      const result = await service.update_experience(
        userId,
        experienceIndex,
        newExperienceData,
      );

      expect(service.update_experience).toHaveBeenCalledWith(
        userId,
        experienceIndex,
        newExperienceData,
      );
      expect(result).toEqual(newExperienceData);
    });

    // Add more test cases for other UserService methods
  });

  describe('update_course', () => {
    it('should update a course in the user curriculum', async () => {
      const userId = 'user_id';
      const courseIndex = 0;
      const newCourseData = {};

      jest.spyOn(service, 'update_course').mockResolvedValue(newCourseData);

      const result = await service.update_course(
        userId,
        courseIndex,
        newCourseData,
      );

      expect(service.update_course).toHaveBeenCalledWith(
        userId,
        courseIndex,
        newCourseData,
      );
      expect(result).toEqual(newCourseData);
    });

    // Add more test cases for other UserService methods
  });

  describe('update_language', () => {
    it('should update a language in the user curriculum', async () => {
      const userId = 'user_id';
      const languageIndex = 0;
      const newLanguageData = {};

      jest.spyOn(service, 'update_language').mockResolvedValue(newLanguageData);

      const result = await service.update_language(
        userId,
        languageIndex,
        newLanguageData,
      );

      expect(service.update_language).toHaveBeenCalledWith(
        userId,
        languageIndex,
        newLanguageData,
      );
      expect(result).toEqual(newLanguageData);
    });

    // Add more test cases for other UserService methods
  });

  describe('delete_study', () => {
    it('should delete a study from the user curriculum', async () => {
      const userId = 'user_id';
      const studyIndex = 0;

      jest.spyOn(service, 'delete_study').mockResolvedValue([]);

      const result = await service.delete_study(userId, studyIndex);

      expect(service.delete_study).toHaveBeenCalledWith(userId, studyIndex);
      expect(result).toEqual([]);
    });

    // Add more test cases for other UserService methods
  });

  describe('delete_experience', () => {
    it('should delete an experience from the user curriculum', async () => {
      const userId = 'user_id';
      const experienceIndex = 0;

      jest.spyOn(service, 'delete_experience').mockResolvedValue([]);

      const result = await service.delete_experience(userId, experienceIndex);

      expect(service.delete_experience).toHaveBeenCalledWith(
        userId,
        experienceIndex,
      );
      expect(result).toEqual([]);
    });

    // Add more test cases for other UserService methods
  });

  describe('delete_course', () => {
    it('should delete a course from the user curriculum', async () => {
      const userId = 'user_id';
      const courseIndex = 0;

      jest.spyOn(service, 'delete_course').mockResolvedValue([]);

      const result = await service.delete_course(userId, courseIndex);

      expect(service.delete_course).toHaveBeenCalledWith(userId, courseIndex);
      expect(result).toEqual([]);
    });

    // Add more test cases for other UserService methods
  });

  describe('delete_language', () => {
    it('should delete a language from the user curriculum', async () => {
      const userId = 'user_id';
      const languageIndex = 0;

      jest.spyOn(service, 'delete_language').mockResolvedValue([]);

      const result = await service.delete_language(userId, languageIndex);

      expect(service.delete_language).toHaveBeenCalledWith(
        userId,
        languageIndex,
      );
      expect(result).toEqual([]);
    });

    // Add more test cases for other UserService methods
  });
});

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
});
