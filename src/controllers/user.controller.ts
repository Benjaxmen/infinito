import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import UserService from '../services/user.service';
import CurriculumService from '../services/curriculum.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService,private readonly curriculumService: CurriculumService) {}


  @Post()
  async create(@Body() userData) {
    return this.userService.create(userData);
  }

  @Get()
  async findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  async read(@Param('id') userId) {
    return this.userService.read(userId);
  }

  @Put(':id')
  async update(@Param('id') userId, @Body() newUserData) {
    return this.userService.update(userId, newUserData);
  }

  @Delete(':id')
  async delete(@Param('id') userId) {
    return this.userService.delete(userId);
  }
  @Post(':id/descripcion')
  async crearDescripcion(@Param('id') userId: string, @Body() descripcion: any){
    return this.userService.create_description(userId,descripcion)
  }
  @Put(':id/descripcion')
  async editarDescripcion(@Param('id') userId: string, @Body() descripcion: any){
    return this.userService.update_description(userId,descripcion)
  }
  @Post(':id/curriculum')
  async createCurriculum(@Param('id') userId: string, @Body() Data: any){
    const course =await this.curriculumService.create_course(userId, Data.courses);
    const skill = await this.curriculumService.create_skill(userId, Data.skills);
    const experience =await this.curriculumService.create_experience(userId, Data.experiences);
    const language = await this.curriculumService.create_language(userId, Data.languages);
    const study =await this.curriculumService.create_study(userId, Data.studies);
    return {course,skill,experience,language,study}
  }
  @Post(':id/course')
  async createCourse(@Param('id') userId: string, @Body() courseData: any) {
    return this.curriculumService.create_course(userId, courseData);
  }
  @Post(':id/skill')
  async createSkill(@Param('id') userId: string, @Body() skillData: any) {
    return this.curriculumService.create_skill(userId, skillData);
  }
  @Post(':id/experience')
  async createExperience(@Param('id') userId: string, @Body() experienceData: any) {
    return this.curriculumService.create_experience(userId, experienceData);
  }
  @Post(':id/language')
  async createLanguage(@Param('id') userId: string, @Body() languageData: any) {
    return this.curriculumService.create_language(userId, languageData);
  }
  @Post(':id/study')
  async createStudy(@Param('id') userId: string, @Body() studyData: any) {
    return this.curriculumService.create_study(userId, studyData);
  }

  @Get(':id/curriculum')
  async readCurriculum(@Param('id') userId) {
    return this.curriculumService.read_curr(userId);
  }
  @Get(':id/study')
  async readStudy(@Param('id') userId) {
    return this.curriculumService.read_studies(userId);
  }
  @Get(':id/skill')
  async readSkill(@Param('id') userId) {
    return this.curriculumService.read_skills(userId);
  }
  @Get(':id/language')
  async readLanguage(@Param('id') userId) {
    return this.curriculumService.read_languages(userId);
  }
  @Get(':id/experience')
  async readExperience(@Param('id') userId) {
    return this.curriculumService.read_experiences(userId);
  }
  @Get(':id/course')
  async readCourse(@Param('id') userId) {
    return this.curriculumService.read_courses(userId);
  }

  @Put(':id/study')
  async updateCurriculumStudy(@Param('id') userId, @Body() payload: any) 
  {
    return this.curriculumService.update_study(userId,payload.name , payload.newstudyData);
  }
  @Put(':id/course')
  async updateCurriculumCourse(@Param('id') userId, @Body() payload: any) 
  {
    return this.curriculumService.update_course(userId,payload.name , payload.newcourseData);
  }
  @Put(':id/experience')
  async updateCurriculumExperience(@Param('id') userId, @Body() payload: any) 
  {
    return this.curriculumService.update_experience(userId,payload.position , payload.newexperienceData);
  }
  @Put(':id/language')
  async updateCurriculumLanguage(@Param('id') userId, @Body() payload: any) 
  {
    return this.curriculumService.update_language(userId,payload.name , payload.newlanguageData);
  }
  @Put(':id/skill')
  async updateCurriculumSkill(@Param('id') userId, @Body() payload: any) 
  {
    return this.curriculumService.update_skill(userId,payload.name , payload.newskillData);
  }
  @Delete(':id/study')
  async deleteCurriculumStudy(@Param('id') userId, @Body() payload: any) 
  {
    return this.curriculumService.delete_study(userId,payload.name , payload.newstudyData);
  }
  @Delete(':id/course')
  async deleteCurriculumCourse(@Param('id') userId, @Body() payload: any) 
  {
    return this.curriculumService.delete_course(userId,payload.name , payload.newcourseData);
  }
  @Delete(':id/experience')
  async deleteCurriculumExperience(@Param('id') userId, @Body() payload: any) 
  {
    return this.curriculumService.delete_experience(userId,payload.position , payload.newexperienceData);
  }
  @Delete(':id/language')
  async deleteCurriculumLanguage(@Param('id') userId, @Body() payload: any) 
  {
    return this.curriculumService.delete_language(userId,payload.name , payload.newlanguageData);
  }
  @Delete(':id/skill')
  async deleteCurriculumSkill(@Param('id') userId, @Body() payload: any) 
  {
    return this.curriculumService.delete_skill(userId,payload.name , payload.newskillData);
  }
  @Get(':id/descripcion')
  async findAll_desc() {
    return this.userService.findAll_desc();
  }

}
