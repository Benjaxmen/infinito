import * as mongoose from 'mongoose';
import CourseSchema from '../schemas/course.schema';
import SkillSchema from '../schemas/skill.schema';
import ExperienceSchema from '../schemas/experience.schema';
import LanguageSchema from '../schemas/language.schema';
import StudySchema from '../schemas/study.schema';
import UserSchema from '../schemas/user.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';

class CurriculumService{
    private userModel = mongoose.model('User', UserSchema);
    private courseModel = mongoose.model('Course', CourseSchema);
    private skillModel = mongoose.model('Skill',SkillSchema);
    private experienceModel = mongoose.model('Experience',ExperienceSchema);
    private languageModel = mongoose.model('Language',LanguageSchema);
    private studyModel = mongoose.model('Study',StudySchema);
    async create_course(userID,courseData){
        if(!courseData){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Ingresa datos válidos' })
          }
        const payload ={userId: userID, name: courseData.name, institution:courseData.institution, completionDate:courseData.completionDate, description:courseData.description}
        const course = new this.courseModel(payload)
        await course.populate('userId')
        await course.save()
        return course;
    }
    async create_skill(userID,skillData){
        if(!skillData){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Ingresa datos válidos' })
          }
        const payload ={userId: userID, name: skillData.name, level: skillData.level}
        const skill = new this.skillModel(payload)
        await skill.populate('userId')
        await skill.save()
        return skill;
    }
    async create_experience(userID,experienceData){
        if(!experienceData){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Ingresa datos válidos' })
          }
        const payload ={userId: userID, position: experienceData.position, company:experienceData.company, startDate:experienceData.startDate, endDate:experienceData.endDate, description:experienceData.description}
        const experience = new this.experienceModel(payload)
        await experience.populate('userId')
        await experience.save()
        return experience;
    }
    async create_language(userID,languageData){
        if(!languageData){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Ingresa datos válidos' })
          }
        const payload ={userId: userID, name: languageData.name, level: languageData.level}
        const language = new this.languageModel(payload)
        await language.populate('userId')
        await language.save()
        return language;
    }
    async create_study(userID,studyData){
        if(!studyData){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Ingresa datos válidos' })
          }
        const payload ={userId: userID, name: studyData.name,type: studyData.type, institution:studyData.institution, admissionDate:studyData.admissionDate, graduationDate:studyData.graduationDate, description:studyData.description}
        const study = new this.studyModel(payload)
        await study.populate('userId')
        await study.save()
        return study;
    }
    async read_curr(userId){
        if (!userId) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Se requiere ID' });
          }
          const user = await this.userModel.findById(userId);
          if (!user) {
            throw new NotFoundException('Usuario no encontrado');
          }
          const courses = await this.courseModel.find({userId: user._id})
          const experiences = await this.experienceModel.find({userId: user._id})
          const languages = await this.languageModel.find({userId: user._id})
          const skills = await this.skillModel.find({userId: user._id})
          const studies = await this.studyModel.find({userId: user._id})
          const payload = {courses:courses, experiences: experiences, languages: languages, skills: skills, studies:studies}
          return payload;
    }
    async update_course(userID,course_name, newcourseData) {
        if (!userID) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Se requiere ID' });
          }
          const user = await this.userModel.findById(userID);
          if (!user) {
            throw new NotFoundException('Usuario no encontrado');
          }

        const course = await this.courseModel.findOneAndUpdate({userId: user._id, name: course_name}, newcourseData, { new: true });
        return course;
      }
      async update_experience(userID,experience_position, newexperienceData) {
        if (!userID) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Se requiere ID' });
          }
          const user = await this.userModel.findById(userID);
          if (!user) {
            throw new NotFoundException('Usuario no encontrado');
          }
        const experience = await this.experienceModel.findOneAndUpdate({userId: user._id,position: experience_position}, newexperienceData, { new: true });
        return experience;
      }
      async update_language(userID,language_name, newlanguageData) {
        if (!userID) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Se requiere ID' });
          }
          const user = await this.userModel.findById(userID);
          if (!user) {
            throw new NotFoundException('Usuario no encontrado');
          }
        const language = await this.languageModel.findOneAndUpdate({userId: user._id,name: language_name}, newlanguageData, { new: true });
        return language;
      }
      async update_skill(userID,skill_name, newskillData) {
        if (!userID) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Se requiere ID' });
          }
          const user = await this.userModel.findById(userID);
          if (!user) {
            throw new NotFoundException('Usuario no encontrado');
          }
        const skill = await this.skillModel.findOneAndUpdate({userId: user._id,name: skill_name}, newskillData, { new: true });
        return skill;
      }
      async update_study(userID,study_name, newstudyData) {
        if (!userID) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Se requiere ID' });
          }
          const user = await this.userModel.findById(userID);
          if (!user) {
            throw new NotFoundException('Usuario no encontrado');
          }
        const study = await this.studyModel.findOneAndUpdate({userId: user._id,name: study_name}, newstudyData, { new: true });
        return study;
      }
      async delete_course(userID,course_name, newcourseData) {
        if (!userID) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Se requiere ID' });
          }
          const user = await this.userModel.findById(userID);
          if (!user) {
            throw new NotFoundException('Usuario no encontrado');
          }

        const course = await this.courseModel.findOneAndDelete({userId: user._id, name: course_name}, newcourseData);
        return course;
      }
      async delete_experience(userID,experience_position, newexperienceData) {
        if (!userID) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Se requiere ID' });
          }
          const user = await this.userModel.findById(userID);
          if (!user) {
            throw new NotFoundException('Usuario no encontrado');
          }
        const experience = await this.experienceModel.findOneAndDelete({userId: user._id,position: experience_position}, newexperienceData);
        return experience;
      }
      async delete_language(userID,language_name, newlanguageData) {
        if (!userID) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Se requiere ID' });
          }
          const user = await this.userModel.findById(userID);
          if (!user) {
            throw new NotFoundException('Usuario no encontrado');
          }
        const language = await this.languageModel.findOneAndDelete({userId: user._id,name: language_name}, newlanguageData);
        return language;
      }
      async delete_skill(userID,skill_name, newskillData) {
        if (!userID) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Se requiere ID' });
          }
          const user = await this.userModel.findById(userID);
          if (!user) {
            throw new NotFoundException('Usuario no encontrado');
          }
        const skill = await this.skillModel.findOneAndDelete({userId: user._id,name: skill_name}, newskillData);
        return skill;
      }
      async delete_study(userID,study_name, newstudyData) {
        if (!userID) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Se requiere ID' });
          }
          const user = await this.userModel.findById(userID);
          if (!user) {
            throw new NotFoundException('Usuario no encontrado');
          }
        const study = await this.studyModel.findOneAndDelete({userId: user._id,name: study_name}, newstudyData);
        return study;
      }

}
export default CurriculumService