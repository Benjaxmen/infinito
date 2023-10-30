import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import UserService from '../services/user.service';
import CurriculumService from '../services/curriculum.service';
import PostulacionService from '../services/postulacion.service';
@Controller('ofertas')
export class PostulacionController {
  constructor(private readonly userService: UserService,private readonly curriculumService: CurriculumService, private readonly postulacionService: PostulacionService) {}

  @Get()
  async findall_off(){
    return this.postulacionService.get_all_offers()
  }
  @Post()
  async post_offer(@Body() payload: any){
    return this.postulacionService.create_offer(payload)
  }
  @Put(':id')
  async update_offer(@Param('id') offerId,@Body() payload: any){
    return this.postulacionService.update_offer(offerId,payload)
  }







}