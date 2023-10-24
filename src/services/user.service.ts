import * as mongoose from 'mongoose';
import UserSchema from './schemas/user.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { isEmail } from 'validator';
import * as bcrypt from 'bcrypt';
import CurriculumSchema from './schemas/curriculum.schema';

class UserService {
  private userModel = mongoose.model('User', UserSchema);
  private curriculumModel = mongoose.model('Curriculum', CurriculumSchema);

  async create(userData) {
    const existingUser = await this.userModel.findOne({
      email: userData.email,
    });
    if (existingUser) {
      throw new BadRequestException('Algo salió mal', {
        cause: new Error(),
        description: 'Ese correo electrónico ya está asociado a una cuenta',
      });
    }
    if (!isEmail(userData.email)) {
      throw new BadRequestException('Algo salió mal', {
        cause: new Error(),
        description: 'Ingresa un correo electrónico válido',
      });
    }
    if (
      !userData.name ||
      !userData.password ||
      !userData.dateofbirth ||
      !userData.profession ||
      !userData.rut ||
      !userData.cellphone
    ) {
      throw new BadRequestException('Algo salió mal', {
        cause: new Error(),
        description: 'Ingresa datos válidos',
      });
    }
    userData.password = await this.hashPassword(userData.password);

    const user = new this.userModel(userData);
    await user.save();
    return user.id;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Number of salt rounds (higher is more secure but slower)

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async validatePassword(userId, password: string) {
    const user = await this.userModel.findOne({ _id: userId });
    const result = await bcrypt.compare(password, user.password);
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
    const user = await this.userModel.find({ _id: userId });
    return user;
  }

  async update(userId, newUserData) {
    const user = await this.userModel.findByIdAndUpdate(userId, newUserData, {
      new: true,
    });
    return user;
  }

  async delete(userId) {
    const user = await this.userModel.findByIdAndDelete(userId);
    return user;
  }

  async create_curr(userId, curriculumData) {
    if (
      !curriculumData.studies ||
      !curriculumData.experiences ||
      !curriculumData.courses ||
      !curriculumData.languages
    ) {
      throw new BadRequestException('Algo salió mal', {
        cause: new Error(),
        description: 'Ingresa datos válidos',
      });
    }
    const curriculum = new this.curriculumModel(curriculumData);
    await curriculum.save();
    await this.userModel.findByIdAndUpdate(userId, {
      $set: { curriculum: curriculum._id },
    });
    return { curriculumId: curriculum._id, userId: userId };
  }

  async read_curr(userId) {
    if (!userId) {
      throw new BadRequestException('Algo salió mal', {
        cause: new Error(),
        description: 'Se requiere ID',
      });
    }
    const user = await this.userModel.findById(userId).populate('curriculum');
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const curriculum = user.curriculum;
    if (!curriculum) {
      throw new NotFoundException('Curriculum no encontrado');
    }
    return curriculum;
  }

  async read_curr_studies(userId) {
    if (!userId) {
      throw new BadRequestException('Se requiere ID');
    }
    const user = await this.userModel.findById(userId).populate({
      path: 'curriculum',
      select: 'studies',
    });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const curriculum = user.curriculum;
    if (!curriculum) {
      throw new NotFoundException('No se econtraron estudios');
    }
    return curriculum;
  }

  async read_curr_experiences(userId) {
    if (!userId) {
      throw new BadRequestException('Se requiere ID');
    }
    const user = await this.userModel
      .findById(userId)
      .populate({ path: 'curriculum', select: 'experiences' });
    const curriculum = user.curriculum;
    if (!curriculum) {
      throw new NotFoundException('No se encontraron experiencias');
    }
    return curriculum;
  }

  async read_curr_courses(userId) {
    if (!userId) {
      throw new BadRequestException('Se requiere ID');
    }
    const user = await this.userModel
      .findById(userId)
      .populate({ path: 'curriculum', select: 'courses' });
    const curriculum = user.curriculum;
    if (!curriculum) {
      throw new NotFoundException('No se encontraron cursos');
    }
    return curriculum;
  }

  async read_curr_languages(userId) {
    if (!userId) {
      throw new BadRequestException('Se requiere ID');
    }
    const user = await this.userModel
      .findById(userId)
      .populate({ path: 'curriculum', select: 'languages' });
    const curriculum = user.curriculum;
    if (!curriculum) {
      throw new NotFoundException('No se encontraron idiomas');
    }
    return curriculum;
  }

  async add_new_study(
    userId: string,
    newCurriculumData: { studies: any[] },
  ): Promise<any[]> {
    if (!userId) {
      throw new BadRequestException('Se requiere ID');
    }
    if (
      !newCurriculumData ||
      !newCurriculumData.studies ||
      !Array.isArray(newCurriculumData.studies)
    ) {
      throw new BadRequestException('Datos de estudio inválidos');
    }
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const curriculumId = user.curriculum;
    if (!curriculumId) {
      throw new NotFoundException('Currículum no encontrado');
    }

    const curriculum = await this.curriculumModel.findByIdAndUpdate(
      curriculumId,
      {
        $push: {
          studies: {
            $each: newCurriculumData.studies,
          },
        },
      },
      { new: true },
    );
    if (!curriculum) {
      throw new NotFoundException('Currículum no encontrado');
    }

    return curriculum.studies;
  }

  async add_new_experience(
    userId: string,
    newCurriculumData: { experiences: any[] },
  ): Promise<any[]> {
    if (!userId) {
      throw new BadRequestException('Se requiere ID');
    }
    if (
      !newCurriculumData ||
      !newCurriculumData.experiences ||
      !Array.isArray(newCurriculumData.experiences)
    ) {
      throw new BadRequestException('Datos de experiencia inválidos');
    }
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const curriculumId = user.curriculum;
    if (!curriculumId) {
      throw new NotFoundException('Currículum no encontrado');
    }
    const curriculum = await this.curriculumModel.findByIdAndUpdate(
      curriculumId,
      {
        $push: {
          experiences: {
            $each: newCurriculumData.experiences,
          },
        },
      },
      { new: true },
    );
    if (!curriculum) {
      throw new NotFoundException('Currículum no encontrado');
    }
    return curriculum.experiences;
  }

  async add_new_course(
    userId: string,
    newCurriculumData: { courses: any[] },
  ): Promise<any[]> {
    if (!userId) {
      throw new BadRequestException('Se requiere ID');
    }
    if (
      !newCurriculumData ||
      !newCurriculumData.courses ||
      !Array.isArray(newCurriculumData.courses)
    ) {
      throw new BadRequestException('Datos de curso inválidos');
    }
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const curriculumId = user.curriculum;
    if (!curriculumId) {
      throw new NotFoundException('Currículum no encontrado');
    }
    const curriculum = await this.curriculumModel.findByIdAndUpdate(
      curriculumId,
      {
        $push: {
          courses: {
            $each: newCurriculumData.courses,
          },
        },
      },
      { new: true },
    );
    if (!curriculum) {
      throw new NotFoundException('Currículum no encontrado');
    }
    return curriculum.courses;
  }

  async add_new_language(
    userId: string,
    newCurriculumData: { languages: any[] },
  ): Promise<any[]> {
    if (!userId) {
      throw new BadRequestException('User ID is required');
    }
    if (
      !newCurriculumData ||
      !newCurriculumData.languages ||
      !Array.isArray(newCurriculumData.languages)
    ) {
      throw new BadRequestException('Invalid language data');
    }
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const curriculumId = user.curriculum;
    if (!curriculumId) {
      throw new NotFoundException('Curriculum not found');
    }
    const curriculum = await this.curriculumModel.findByIdAndUpdate(
      curriculumId,
      {
        $push: {
          languages: {
            $each: newCurriculumData.languages,
          },
        },
      },
      { new: true },
    );
    if (!curriculum) {
      throw new NotFoundException('Curriculum not found');
    }
    return curriculum.languages;
  }

  async update_study(userId: string, studyIndex: number, newStudyData: any) {
    const user = await this.userModel.findById(userId);
    const curriculumId = user.curriculum;
    const curriculum = await this.curriculumModel.findById(curriculumId);
    if (studyIndex < 0 || studyIndex >= curriculum.studies.length) {
      throw new BadRequestException('Índice de estudio inválido');
    }
    if (!newStudyData || Object.keys(newStudyData).length === 0) {
      throw new BadRequestException(
        'Los datos del estudio no pueden estar vacíos',
      );
    }
    curriculum.studies[studyIndex] = {
      ...curriculum.studies[studyIndex],
      ...newStudyData,
    };
    await curriculum.save();
    return curriculum.studies[studyIndex];
  }

  async update_experience(
    userId: string,
    experienceIndex: number,
    newExperienceData: any,
  ) {
    const user = await this.userModel.findById(userId);
    const curriculumId = user.curriculum;
    const curriculum = await this.curriculumModel.findById(curriculumId);
    if (
      experienceIndex < 0 ||
      experienceIndex >= curriculum.experiences.length
    ) {
      throw new BadRequestException('Índice de experiencia inválido');
    }
    if (!newExperienceData || Object.keys(newExperienceData).length === 0) {
      throw new BadRequestException(
        'Los datos de la experiencia no pueden estar vacíos',
      );
    }
    curriculum.experiences[experienceIndex] = {
      ...curriculum.experiences[experienceIndex],
      ...newExperienceData,
    };
    await curriculum.save();
    return curriculum.experiences[experienceIndex];
  }

  async update_course(userId: string, courseIndex: number, newCourseData: any) {
    const user = await this.userModel.findById(userId);
    const curriculumId = user.curriculum;
    const curriculum = await this.curriculumModel.findById(curriculumId);
    if (courseIndex < 0 || courseIndex >= curriculum.courses.length) {
      throw new BadRequestException('Índice de curso inválido');
    }
    if (!newCourseData || Object.keys(newCourseData).length === 0) {
      throw new BadRequestException(
        'Los datos del curso no pueden estar vacíos',
      );
    }
    curriculum.courses[courseIndex] = {
      ...curriculum.courses[courseIndex],
      ...newCourseData,
    };
    await curriculum.save();
    return curriculum.courses[courseIndex];
  }

  async update_language(
    userId: string,
    languageIndex: number,
    newLanguageData: any,
  ) {
    const user = await this.userModel.findById(userId);
    const curriculumId = user.curriculum;
    const curriculum = await this.curriculumModel.findById(curriculumId);
    if (languageIndex < 0 || languageIndex >= curriculum.languages.length) {
      throw new BadRequestException('Índice de idioma inválido');
    }
    if (!newLanguageData || Object.keys(newLanguageData).length === 0) {
      throw new BadRequestException(
        'Los datos del idioma no pueden estar vacíos',
      );
    }
    curriculum.languages[languageIndex] = {
      ...curriculum.languages[languageIndex],
      ...newLanguageData,
    };
    await curriculum.save();
    return curriculum.studies[languageIndex];
  }

  async delete_study(userId: string, studyIndex: number) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const curriculumId = user.curriculum;
    const curriculum = await this.curriculumModel.findById(curriculumId);
    if (!curriculum) {
      throw new NotFoundException('Currículum no encontrado');
    }
    if (studyIndex < 0 || studyIndex >= curriculum.studies.length) {
      throw new BadRequestException('Índice de estudio inválido');
    }
    curriculum.studies.splice(studyIndex, 1);
    await curriculum.save();
    return curriculum.studies;
  }

  async delete_experience(userId: string, experienceIndex: number) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const curriculumId = user.curriculum;
    const curriculum = await this.curriculumModel.findById(curriculumId);
    if (!curriculum) {
      throw new NotFoundException('Currículum no encontrado');
    }
    if (
      experienceIndex < 0 ||
      experienceIndex >= curriculum.experiences.length
    ) {
      throw new BadRequestException('Índice de experiencia inválido');
    }
    curriculum.experiences.splice(experienceIndex, 1);
    await curriculum.save();
    return curriculum.experiences;
  }

  async delete_course(userId: string, courseIndex: number) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const curriculumId = user.curriculum;
    const curriculum = await this.curriculumModel.findById(curriculumId);
    if (!curriculum) {
      throw new NotFoundException('Currículum no encontrado');
    }
    if (courseIndex < 0 || courseIndex >= curriculum.courses.length) {
      throw new BadRequestException('Índice de curso inválido');
    }
    curriculum.courses.splice(courseIndex, 1);
    await curriculum.save();
    return curriculum.courses;
  }

  async delete_language(userId: string, languageIndex: number) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const curriculumId = user.curriculum;
    const curriculum = await this.curriculumModel.findById(curriculumId);
    if (!curriculum) {
      throw new NotFoundException('Currículum no encontrado');
    }
    if (languageIndex < 0 || languageIndex >= curriculum.languages.length) {
      throw new BadRequestException('Índice de idioma inválido');
    }
    curriculum.languages.splice(languageIndex, 1);
    await curriculum.save();
    return curriculum.languages;
  }
}

export default UserService;
