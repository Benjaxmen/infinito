import * as mongoose from 'mongoose';
import UserSchema from '../schemas/user.schema';
import { BadRequestException } from '@nestjs/common';
import { isEmail } from 'validator';
import * as bcrypt from 'bcrypt';
import CurriculumSchema from 'src/schemas/curriculum.schema';

class UserService {
  private userModel = mongoose.model('User', UserSchema);
  private curriculumModel = mongoose.model('Curriculum', CurriculumSchema);
  
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

  async findOne(filter: Record<string, any>) {
    const user = await this.userModel.findOne(filter);
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

  async create_curr(userId, curriculumData) {
    const curriculum = new this.curriculumModel(curriculumData);
    await curriculum.save();
    await this.userModel.findByIdAndUpdate(userId, { $set: { curriculum: curriculum._id } });
    return { curriculumId: curriculum._id, userId: userId};
  }

  async read_curr(userId) {
  const user = await this.userModel.findById(userId).populate('curriculum');
  const curriculum = user.curriculum;
  return curriculum;
  }

  async read_curr_studies(userId) {
  const user = await this.userModel.findById(userId).populate({path: 'curriculum',
    select: 'studies'});
    const curriculum = user.curriculum;
    return curriculum;
  }

  async read_curr_experiences(userId) {
    const user = await this.userModel.findById(userId).populate({path: 'curriculum',
      select: 'experiences'});
      const curriculum = user.curriculum;
      return curriculum;
  }

  async read_curr_courses(userId) {
  const user = await this.userModel.findById(userId).populate({path: 'curriculum',
    select: 'courses'});
    const curriculum = user.curriculum;
    return curriculum;
  }

  async read_curr_languages(userId) {
    const user = await this.userModel.findById(userId).populate({path: 'curriculum',
      select: 'languages'});
      const curriculum = user.curriculum;
      return curriculum;
  }
      
async add_new_study(userId, newCurriculumData) {
  const user = await this.userModel.findById(userId);
  const curriculumId = user.curriculum;
  const curriculum = await this.curriculumModel.findByIdAndUpdate(curriculumId, {
    $push: {
      studies: {
        $each: newCurriculumData.studies
      }
    }
  }, { new: true });
  return curriculum.studies;
  }

async add_new_experience(userId, newCurriculumData) {
  const user = await this.userModel.findById(userId);
  const curriculumId = user.curriculum;
  const curriculum = await this.curriculumModel.findByIdAndUpdate(curriculumId, {
    $push: {
      experiences: {
        $each: newCurriculumData.experiences
      }
    }
  }, { new: true });
  return curriculum.experiences;
  }

async add_new_course(userId, newCurriculumData) {
  const user = await this.userModel.findById(userId);
  const curriculumId = user.curriculum;
  const curriculum = await this.curriculumModel.findByIdAndUpdate(curriculumId, {
    $push: {
      courses: {
        $each: newCurriculumData.courses
      }
    }
  }, { new: true });
  return curriculum.courses;
  }

async add_new_language(userId, newCurriculumData) {
  const user = await this.userModel.findById(userId);
  const curriculumId = user.curriculum;
  const curriculum = await this.curriculumModel.findByIdAndUpdate(curriculumId, {
    $push: {
      languages: {
        $each: newCurriculumData.languages
      }
    }
  }, { new: true });
  return curriculum.languages;
  }

async update_study(userId, studyIndex, newStudyData) {
  const user = await this.userModel.findById(userId);
  const curriculumId = user.curriculum;
  const curriculum = await this.curriculumModel.findById(curriculumId);
  if (studyIndex < 0 || studyIndex >= curriculum.studies.length) {
    throw new BadRequestException('Invalid study index');
  }
  curriculum.studies[studyIndex] = { ...curriculum.studies[studyIndex], ...newStudyData };
  await curriculum.save();
  return curriculum.studies[studyIndex];
}

async update_experience(userId, experienceIndex, newExperienceData) {
  const user = await this.userModel.findById(userId);
  const curriculumId = user.curriculum;
  const curriculum = await this.curriculumModel.findById(curriculumId);
  if (experienceIndex < 0 || experienceIndex >= curriculum.experiences.length) {
    throw new BadRequestException('Invalid experience index');
  }
  curriculum.experiences[experienceIndex] = { ...curriculum.experiences[experienceIndex], ...newExperienceData };
  await curriculum.save();
  return curriculum.experiences[experienceIndex];
}

async update_course(userId, courseIndex, newCourseData) {
  const user = await this.userModel.findById(userId);
  const curriculumId = user.curriculum;
  const curriculum = await this.curriculumModel.findById(curriculumId);
  if (courseIndex < 0 || courseIndex >= curriculum.courses.length) {
    throw new BadRequestException('Invalid course index');
  }
  curriculum.courses[courseIndex] = { ...curriculum.courses[courseIndex], ...newCourseData };
  await curriculum.save();
  return curriculum.courses[courseIndex];
}

async update_language(userId, languageIndex, newLanguageData) {
  const user = await this.userModel.findById(userId);
  const curriculumId = user.curriculum;
  const curriculum = await this.curriculumModel.findById(curriculumId);
  if (languageIndex < 0 || languageIndex >= curriculum.languages.length) {
    throw new BadRequestException('Invalid language index');
  }
  curriculum.languages[languageIndex] = { ...curriculum.languages[languageIndex], ...newLanguageData };
  await curriculum.save();
  return curriculum.studies[languageIndex];
}

async delete_study(userId: string, studyIndex: number) {
  const user = await this.userModel.findById(userId);
  const curriculumId = user.curriculum;
  const curriculum = await this.curriculumModel.findById(curriculumId);
  if (studyIndex < 0 || studyIndex >= curriculum.studies.length) {
    throw new BadRequestException('Invalid study index');
  }
  curriculum.studies.splice(studyIndex, 1);
  await curriculum.save();
  return curriculum.studies;
}

async delete_experience(userId: string, experienceIndex: number) {
  const user = await this.userModel.findById(userId);
  const curriculumId = user.curriculum;
  const curriculum = await this.curriculumModel.findById(curriculumId);
  if (experienceIndex < 0 || experienceIndex >= curriculum.experiences.length) {
    throw new BadRequestException('Invalid experience index');
  }
  curriculum.experiences.splice(experienceIndex, 1);
  await curriculum.save();
  return curriculum.experiences;
  }

async delete_course(userId: string, courseIndex: number) {
  const user = await this.userModel.findById(userId);
  const curriculumId = user.curriculum;
  const curriculum = await this.curriculumModel.findById(curriculumId);
  if (courseIndex < 0 || courseIndex >= curriculum.courses.length) {
    throw new BadRequestException('Invalid course index');
  }
  curriculum.courses.splice(courseIndex, 1);
  await curriculum.save();
  return curriculum.courses;
  }

async delete_language(userId: string, languageIndex: number) {
  const user = await this.userModel.findById(userId);
  const curriculumId = user.curriculum;
  const curriculum = await this.curriculumModel.findById(curriculumId);
  if (languageIndex < 0 || languageIndex >= curriculum.languages.length) {
    throw new BadRequestException('Invalid language index');
  }
  curriculum.languages.splice(languageIndex, 1);
  await curriculum.save();
  return curriculum.languages;
  }

}

export default UserService;
