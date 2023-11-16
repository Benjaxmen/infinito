import * as mongoose from 'mongoose';
import PostulanteSchema from '../schemas/postulante.schema';
import UserSchema from '../schemas/user.schema';
import OfertaSchema from '../schemas/oferta.schema';
import { BadRequestException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
/**
 * PostulacionService class.
 * This class provides methods to manage offers and applications.
 */
class PostulacionService{
    private userModel = mongoose.model("User",UserSchema);
    private ofertaModel = mongoose.model("Oferta",OfertaSchema);
    private postulanteModel = mongoose.model("Postulante",PostulanteSchema);

    /**
     * Finds an offer by its ID.
     * @param offerId - The ID of the offer.
     * @returns The offer object if it exists, otherwise throws an exception.
     */
    async find(offerId){
        // Validate offerId
        if (!mongoose.Types.ObjectId.isValid(offerId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const oferta=this.ofertaModel.findById(offerId)
        // Check if offer exists
        if(!oferta){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Esta oferta no existe' })
        }
        return oferta    
    }

    /**
     * Creates a new offer.
     * @param offer_data - The data of the new offer.
     * @returns The ID of the created offer.
     */
        // Validate recruiter ID
        async create_offer(offer_data) {
        if (!mongoose.Types.ObjectId.isValid(offer_data.reclutadorId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const user = await this.userModel.findOne({_id: offer_data.reclutadorId});
        // Check if user exists
        if(!user){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no existe' })
        }          
        
        // Check if user has the necessary permissions
        if(!(user.rol == 'Reclutador')&&!(user.rol =='Admin')){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no tiene los permisos necesarios' })
        }
        // Create new offer
        // Save the new offer
        await oferta.save();
        return oferta.id;
    }

    /**
     * Updates an existing offer.
     * @param offerId - The ID of the offer to update.
     * @param offer_data - The new data for the offer.
     * @returns The updated offer object.
     */
    async update_offer(offerId,offer_data){
        // Validate offerId
        if (!mongoose.Types.ObjectId.isValid(offerId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Esta oferta no existe' })
        }
        let offer: any;
        try { 
            // Update the offer
            offer = await this.ofertaModel.findByIdAndUpdate(offerId, offer_data, {new:true});            
        } catch (error) {
            if (error.message.toString().includes("No such object")){
                throw new NotFoundException("Object not found");
            }
            else{
                throw new ServiceUnavailableException("Internal error")
            }
            
        }
        return offer;
    }

    /**
     * Retrieves an offer by its ID.
     * @param offerId - The ID of the offer.
     * @returns The offer object if it exists, otherwise throws an exception.
     */
    async get_offer(offerId){
        // Validate offerId
        if (!mongoose.Types.ObjectId.isValid(offerId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const offer = await this.ofertaModel.findById(offerId)
        // Check if offer exists
        if (!offer) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Esta oferta no existe' })
        }
        return offer;
    }
    
    /**
     * Retrieves all offers created by a user.
     * @param userId - The ID of the user.
     * @returns An array of offer objects if they exist, otherwise throws an exception.
     */
        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId.userId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const offer = await this.ofertaModel.find({reclutadorId: userId.userId})
        // Check if user has created any offers
        if (!offer) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no ha creado ofertas' })
          }
        return offer;
    }
    
    /**
     * Retrieves all offers.
     * @returns An array of all offer objects.
     */
    async get_all_offers(){
        const offers = await this.ofertaModel.find()
        return offers;
    }
    
    /**
     * Retrieves a batch of offers based on the page number.
     * @param page - The page number.
     * @param size - The number of offers per page.
     * @returns An array of offer objects for the specified page.
     */
    async get_offer_page(page:number,size:number){
        // Calculate the number of offers to skip
        const skip =(page-1)*size
        const offers = await this.ofertaModel.find().skip(skip).limit(size).exec()
        return offers;
    }
     * Deletes an offer.
     * @param offerId - The ID of the offer to delete.
     * @param payload - The details of the deletion.
     * @returns A confirmation of the deletion if successful, otherwise throws an exception.
     */
     async delete_offer(offerId,payload){
        // Validate offerId and userId
        if (!mongoose.Types.ObjectId.isValid(offerId)||!mongoose.Types.ObjectId.isValid(payload.userId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const oferta= await this.ofertaModel.findById(offerId)
        // Check if offer exists
        if (!oferta){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Oferta no encontrada' })
        }
        const user = await this.userModel.findOne({_id: payload.userId})
        // Check if user exists
        if (!user){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Usuario no encontrado' })        
        }
        // Check if user has the necessary permissions
        if (oferta.reclutadorId==user._id||user.rol=="Admin"){
            // Delete the offer
            this.ofertaModel.findByIdAndDelete(offerId)
            return ("Borrado exitoso")
        }
        else{
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'No se pudo borrar la oferta' })
        }        
    
        // Check if user exists
        if (!user){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Usuario no encontrado' })        
        }
        // Check if user has the necessary permissions
        if (oferta.reclutadorId==user._id||user.rol=="Admin"){
            // Delete the offer
            this.ofertaModel.findByIdAndDelete(offerId)
            return ("Borrado exitoso")
        }
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Usuario no encontrado' })        
        // Check if user has the necessary permissions
        if (oferta.reclutadorId==user._id||user.rol=="Admin"){
            // Delete the offer
            this.ofertaModel.findByIdAndDelete(offerId)
            return ("Borrado exitoso");
        }
        else{
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'No se pudo borrar la oferta' })
        }        
    }
     * Finds offers based on the provided filter.
     * @param filter - The filter criteria.
     * @returns An array of offer objects that match the filter criteria.
     */
    async find_offer(filter: Record<string, any>){
        // Check if filter includes tags
        if (filter.tags && filter.tags.length > 0) {
            filter.tags = { $all: filter.tags };
        }
        return await this.ofertaModel.find(filter).exec();
    }
    
    /**
     * Applies a user to an offer.
     * @param offerId - The ID of the offer to apply to.
     * @param payload - The details of the application.
     * @returns The created application object if successful, otherwise throws an exception.
     */
        // Check if user has already applied to the offer
        if(postulacion_previa){
            return postulacion_previa;
        }
        // Create new application
        const postulacion = await new this.postulanteModel({userId: postulante._id,oferta: oferta._id , estado: "Pendiente"})
        await postulacion.save()
        return postulacion;
    }
        const oferta = await this.ofertaModel.findById(offerId)
        // Check if offer exists
        if (!oferta) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Esta oferta no existe' })
        }
        // Check if user has already applied to the offer
        if(postulacion_previa){
            return postulacion_previa
        }
        // Create new application
        const postulacion = await new this.postulanteModel({userId: postulante._id,oferta: oferta._id , estado: "Pendiente"})
        await postulacion.save()
        return postulacion;
        return postulaciones;
    }
    async buscar_ofertas_usuario(userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const reclutador = await this.userModel.findById(userId);
        if (!reclutador) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no existe' });
        }
    
        const ofertas = await this.ofertaModel
            .find({ userId: reclutador._id })
    
        if (!ofertas || ofertas.length === 0) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no posee postulaciones' });
        }
    
        return ofertas;
    }
    async buscar_postulantes_a_oferta(offerId){
        if (!mongoose.Types.ObjectId.isValid(offerId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const oferta= await this.ofertaModel.findById(offerId);
        if(!oferta){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Esta oferta no existe' })
        }
        const usuarios = await this.postulanteModel.find({oferta: oferta._id}).populate('usuario',"userId name")
        return usuarios;
    }
    
    }
    export default PostulacionService;
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Esta postulación no existe' })
          }
        if (postulacion.userId==user._id||user.rol=="Admin"){
            return await this.postulanteModel.findByIdAndDelete(postulacionId)

        }
    }
    async buscar_postulaciones_usuario(userId){
        if (!mongoose.Types.ObjectId.isValid(userId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const postulante = await this.userModel.findById(userId)
        if (!postulante) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no existe' })
          }
        const postulaciones = await this.postulanteModel.find({userId:postulante._id}).populate('oferta')
        if (!postulaciones){throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no posee postulaciones' })
        
        }
        return postulaciones;
    }
    async buscar_ofertas_usuario(userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const reclutador = await this.userModel.findById(userId);
        if (!reclutador) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no existe' });
        }
    
        const ofertas = await this.ofertaModel
            .find({ userId: reclutador._id })
    
        if (!ofertas || ofertas.length === 0) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no posee postulaciones' });
        }
    
        return ofertas;
    }
    async buscar_postulantes_a_oferta(offerId){
        if (!mongoose.Types.ObjectId.isValid(offerId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const oferta= await this.ofertaModel.findById(offerId);
        if(!oferta){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Esta oferta no existe' })
        }
        const usuarios = await this.postulanteModel.find({oferta: oferta._id}).populate('usuario',"userId name")
        return usuarios
    }

}
export default PostulacionService;