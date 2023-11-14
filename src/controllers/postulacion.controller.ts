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
  @Get(':page/:size')
  async get_offers_batch(@Param('page')page,@Param('size')size ){
    return this.postulacionService.get_offer_page(page,size)

  }
  @Get(':filter')
  async filter_offers(@Param('filter')filter: string){
    const parsedFilter = JSON.parse(filter);
    return this.postulacionService.find_offer(parsedFilter)
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
  @Get('/postulaciones/:id')
  async buscar_postulaciones_oferta(@Param('id') offerId){
    return this.postulacionService.buscar_postulantes_a_oferta(offerId)
  }
  @Delete('/postulacion/:id')
  async borrar_postulacion(@Param('id') postulacionId,@Body() payload){
    return this.postulacionService.delete_postulacion(postulacionId,payload)
  }
  @Get('/postulacion/user/:id')
  async buscar_postulaciones(@Param('id') userId){
    return this.postulacionService.buscar_postulaciones_usuario(userId)
  }
  @Get('/user/:id/')
  async buscar_ofertas(@Param('id') userId){
    return this.postulacionService.buscar_ofertas_usuario(userId)
  }
  @Get('/historial/:id')
  async get_historial(@Param('id') id){
    return this.userService.historial_usuario(id)
  }





}