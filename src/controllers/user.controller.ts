import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import UserService from '../services/user.service';
//import CurriculumService from 'src/services/curriculum.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}


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

  @Post(':id/curriculum')
  async createCurriculum(@Param('id') userId: string, @Body() curriculumData: any) {
    return this.userService.create_curr(userId, curriculumData);
  }

  @Get(':id/curriculum')
  async readCurriculum(@Param('id') userId) {
    return this.userService.read_curr(userId);
  }

  @Get(':id/curriculum/studies')
  async readCurriculumStudies(@Param('id') userId) {
    return this.userService.read_curr_studies(userId);
  }

  @Get(':id/curriculum/experiences')
  async readCurriculumExperiences(@Param('id') userId) {
    return this.userService.read_curr_experiences(userId);
  }

  @Get(':id/curriculum/courses')
  async readCurriculumCourses(@Param('id') userId) {
    return this.userService.read_curr_courses(userId);
  }

  @Get(':id/curriculum/languages')
  async readCurriculumLanguages(@Param('id') userId) {
    return this.userService.read_curr_languages(userId);
  }

  @Put(':id/curriculum/studies')
  async updateCurriculumStudies(@Param('id') userId, @Body() newUserData) {
    return this.userService.add_new_study(userId, newUserData);
  }

  @Put(':id/curriculum/experiences')
  async updateCurriculumExperiences(@Param('id') userId, @Body() newUserData) {
    return this.userService.add_new_experience(userId, newUserData);
  }

  @Put(':id/curriculum/courses')
  async updateCurriculumCourses(@Param('id') userId, @Body() newUserData) {
    return this.userService.add_new_course(userId, newUserData);
  }

  @Put(':id/curriculum/languages')
  async updateCurriculumLanguages(@Param('id') userId, @Body() newUserData) {
    return this.userService.add_new_language(userId, newUserData);
  }

  @Put(':id/curriculum/studies/:index')
  async updateCurriculumStudy(@Param('id') userId, @Param('index') index: number, @Body() newUserData) 
  {
    return this.userService.update_study(userId, index, newUserData);
  }

  @Put(':id/curriculum/experiences/:index')
  async updateCurriculumExperience(@Param('id') userId, @Param('index') index: number, @Body() newUserData) 
  {
    return this.userService.update_experience(userId, index, newUserData);
  }

  @Put(':id/curriculum/courses/:index')
  async updateCurriculumCourse(@Param('id') userId, @Param('index') index: number, @Body() newUserData) 
  {
    return this.userService.update_course(userId, index, newUserData);
  }

  @Put(':id/curriculum/languages/:index')
  async updateCurriculumLanguage(@Param('id') userId, @Param('index') index: number, @Body() newUserData) 
  {
    return this.userService.update_language(userId, index, newUserData);
  }

  @Delete(':id/curriculum/studies/:index')
  async deleteCurriculumStudy(@Param('id') userId, @Param('index') index: number) {
    return this.userService.delete_study(userId, index);
  }

  @Delete(':id/curriculum/experiences/:index')
  async deleteCurriculumExperience(@Param('id') userId, @Param('index') index: number) {
    return this.userService.delete_experience(userId, index);
  }

  @Delete(':id/curriculum/courses/:index')
  async deleteCurriculumCourse(@Param('id') userId, @Param('index') index: number) {
    return this.userService.delete_course(userId, index);
  }

  @Delete(':id/curriculum/languages/:index')
  async deleteCurriculumLanguage(@Param('id') userId, @Param('index') index: number) {
    return this.userService.delete_language(userId, index);
  }
  

}
