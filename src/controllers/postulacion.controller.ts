import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import UserService from '../services/user.service';
import CurriculumService from '../services/curriculum.service';
import PostulacionService from '../services/postulacion.service';
@Controller('ofertas')
export class PostulacionController {
  constructor(private readonly userService: UserService,private readonly curriculumService: CurriculumService, private readonly postulacionService: PostulacionService) {}
  
  /**
   * Retrieves an offer by its ID.
   * @param id - The ID of the offer.
   * @returns The offer object.
   */
  @Get("/oferta/:id")
  async find_offer_id(@Param('id')id){
    return this.postulacionService.find(id)
  }

  /**
   * Retrieves all offers.
   * @returns An array of all offer objects.
   */
  @Get()
  async findall_off(){
    return this.postulacionService.get_all_offers()
  }

  /**
   * Retrieves a batch of offers based on the page number.
   * @param page - The page number.
   * @returns An array of offer objects for the specified page.
   */
  @Get('/pagina/:page')
  async get_offers_batch(@Param('page')page){
    return this.postulacionService.get_offer_page(page,20)
  }

  /**
   * Filters offers based on the provided filter.
   * @param filter - The filter criteria.
   * @returns An array of offer objects that match the filter criteria.
   */
  @Get(':filter')
  async filter_offers(@Param('filter')filter: string){
    const parsedFilter = JSON.parse(filter);
    return this.postulacionService.find_offer(parsedFilter)
  }

  /**
   * Creates a new offer.
   * @param payload - The offer details.
   * @returns The created offer object.
   */
  @Post()
  /**
   * Updates an existing offer.
   * @param offerId - The ID of the offer to update.
   * @param payload - The updated offer details.
   * @returns The updated offer object.
   */
  @Put(':id')
  async update_offer(@Param('id') offerId,@Body() payload){
    return this.postulacionService.update_offer(offerId,payload)
  }
  
  /**
   * Deletes an offer.
   * @param offerId - The ID of the offer to delete.
   * @param userId - The ID of the user deleting the offer.
   * @returns A confirmation of the deletion.
   */
  @Delete(':id')
  async delete_off(@Param('id') offerId,@Body() userId){
    return await this.postulacionService.delete_offer(offerId,userId)
  }
  
  /**
   * Applies a user to an offer.
   * @param offerId - The ID of the offer to apply to.
   * @param postulanteId - The ID of the user applying.
   * @returns The created application object.
   */
  @Post(':id')
  async postular(@Param('id') offerId, @Body() postulanteId){
    return this.postulacionService.postulacion(offerId,postulanteId)
  }
  
  /**
   * Retrieves all applications for an offer.
   * @param offerId - The ID of the offer.
   * @returns An array of application objects for the specified offer.
   */
  @Get('/postulaciones/:id')
  async buscar_postulaciones_oferta(@Param('id') offerId){
    return this.postulacionService.buscar_postulantes_a_oferta(offerId)
  }
  
  /**
   * Deletes an application.
   * @param postulacionId - The ID of the application to delete.
   * @param payload - The details of the deletion.
   * @returns A confirmation of the deletion.
   */
  /**
   * Retrieves all applications for a user.
   * @param userId - The ID of the user.
   * @returns An array of application objects for the specified user.
   */
  @Get('/postulacion/user/:id')
  async buscar_postulaciones(@Param('id') userId){
    return this.postulacionService.buscar_postulaciones_usuario(userId)
  }

  /**
   * Retrieves all offers for a user.
   * @param userId - The ID of the user.
   * @returns An array of offer objects for the specified user.
   */
  @Get('/user/:id/')
  async buscar_ofertas(@Param('id') userId){
    return this.postulacionService.buscar_ofertas_usuario(userId)
  }

  /**
   * Retrieves the history of a user.
   * @param id - The ID of the user.
   * @returns The user's history object.
   */
  @Get('/historial/:id')
  async get_historial(@Param('id') id){
    return this.userService.historial_usuario(id)
  }

  /**
   * Updates the history of a user.
   * @param userId - The ID of the user.
   * @param payload - The updated history details.
   * @returns The updated history object.
   */
  @Put('/historial/:id')
  async actualizar_historial(@Param('id') userId, @Body() payload){
    const payload2={postulanteId:userId}
    this.postulacionService.postulacion(payload.offerId,payload2)
    return this.userService.update_historial(userId,payload)
  }

  /**
   * Deletes the history of a user.
   * @param userId - The ID of the user.
   * @param payload - The details of the deletion.
   * @returns A confirmation of the deletion.
   */
  @Delete('/historial/:id')
  async borrar_historial(@Param('id') userId, @Body() payload){
    return this.userService.delete_historial(userId,payload)
  }
}