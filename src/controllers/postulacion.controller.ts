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
  async post_offer(@Body() payload){
  return this.postulacionService.create_offer(payload)
  }
  @Put(':id')
  async update_offer(@Param('id') offerId,@Body() payload){
    return this.postulacionService.update_offer(offerId,payload)
  }
  @Delete(':id')
  async delete_off(@Param('id') offerId,@Body() userId){
    return await this.postulacionService.delete_offer(offerId,userId)
  }
  @Post(':id')
  async postular(@Param('id') offerId, @Body() postulanteId){
    return this.postulacionService.postulacion(offerId,postulanteId)
  }
  @Delete('/postulacion/:id')
  async borrar_postulacion(@Param('id') postulacionId,@Body() payload){
    return this.postulacionService.delete_postulacion(postulacionId,payload)
  }
  @Get('/postulacion/user/:id')
  async buscar_postulaciones(@Param('id') userId){
    return this.postulacionService.buscar_postulaciones_usuario(userId)
  }
  @Get('/postulacion/offer/:id/')
  async buscar_ofertas(@Param('id') userId){
    return this.postulacionService.buscar_ofertas_postulaciones_usuario(userId)
  }





}