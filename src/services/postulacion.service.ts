import * as mongoose from 'mongoose';
import PostulanteSchema from '../schemas/postulante.schema';
import UserSchema from '../schemas/user.schema';
import OfertaSchema from '../schemas/oferta.schema';
import { BadRequestException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
class PostulacionService{
    private userModel = mongoose.model("User",UserSchema);
    private ofertaModel = mongoose.model("Oferta",OfertaSchema);
    private postulanteModel = mongoose.model("Postulante",PostulanteSchema);
    async create_offer(offer_data ){
        if (!mongoose.Types.ObjectId.isValid(offer_data.reclutadorId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const user = await this.userModel.findOne({_id: offer_data.reclutadorId});
        if(!user){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no existe' })
        }          
        
        if(!(user.rol == 'Reclutador')&&!(user.rol =='Admin')){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no tiene los permisos necesarios' })
        }
        const oferta =  new this.ofertaModel(offer_data)
        await oferta.save();
        return oferta.id;

    }
    async update_offer(offerId,offer_data){
        if (!mongoose.Types.ObjectId.isValid(offer_data.offerId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no existe' })
        }
        let offer: any;
        try { offer = await this.ofertaModel.findByIdAndUpdate(offerId, offer_data, {new:true});            
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
    async get_offer(offerId){
        if (!mongoose.Types.ObjectId.isValid(offerId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const offer = await this.ofertaModel.findById(offerId)
        if (!offer) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Esta oferta no existe' })
          }
        return offer
    }
    async get_offers(userId){
        if (!mongoose.Types.ObjectId.isValid(userId.userId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const offer = await this.ofertaModel.find({reclutadorId: userId.userId})
        if (!offer) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no ha creado ofertas' })
          }
        return offer
    }
    async get_all_offers(){
        const offers = await this.ofertaModel.find()
        return offers
    }
    async delete_offer(offerId,payload){
        if (!mongoose.Types.ObjectId.isValid(offerId)||!mongoose.Types.ObjectId.isValid(payload.userId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const oferta= await this.ofertaModel.findById(offerId)
        if (!oferta){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Oferta no encontrada' })
        }
        const user = await this.userModel.findOne({_id: payload.userId})
    
        if (!user){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Usuario no encontrado' })        }
        if (oferta.reclutadorId==user._id||user.rol=="Admin"){
            this.ofertaModel.findByIdAndDelete(offerId)
            return ("Borrado exitoso")
        }
        else{
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'No se pudo borrar la oferta' })

        }        
    
    }
    async find_offer(filter: Record<string, any>){
        return await this.ofertaModel.find(filter)
    }
    async postulacion(offerId,payload){
        if (!mongoose.Types.ObjectId.isValid(offerId)||!mongoose.Types.ObjectId.isValid(payload.userId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const postulante = await this.userModel.findById(payload.postulanteId)
        if (!postulante) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no existe' })
          }
        const oferta = await this.ofertaModel.findById(offerId)
        if (!oferta) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Esta oferta no existe' })
          }
        const postulacion_previa = await this.postulanteModel.find({userId:postulante._id,oferta:oferta._id})
        if(postulacion_previa){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Ya postulaste a esta oferta' })
        }
        const postulacion = await new this.postulanteModel({userId: postulante._id,oferta: oferta._id , estado: "Pendiente"})
        return postulacion;
    }
    async delete_postulacion(postulacionId,payload){
        if (!mongoose.Types.ObjectId.isValid(payload.userId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const user= await this.userModel.findById(payload.userId)
        if (!user) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no existe' })
          }
        const postulacion= await this.postulanteModel.findById(postulacionId)
        if (!postulacion) {
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
        const postulaciones = await this.postulanteModel.find({userId:postulante._id})
        if (!postulaciones){throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no posee postulaciones' })
        
        }
        return postulaciones;
    }
    async buscar_ofertas_postulaciones_usuario(userId) {
        if (!mongoose.Types.ObjectId.isValid(userId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const postulante = await this.userModel.findById(userId);
        if (!postulante) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no existe' });
        }
    
        const postulaciones = await this.postulanteModel
            .find({ userId: postulante._id })
            .populate('oferta') // Utiliza populate para obtener los objetos de oferta completos
            .exec();
    
        if (!postulaciones || postulaciones.length === 0) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no posee postulaciones' });
        }
    
        return postulaciones;
    }
    async buscar_postulantes_a_ofertas(userId){
        if (!mongoose.Types.ObjectId.isValid(userId)){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
        }
        const reclutador = await this.userModel.findById(userId)
        if (!reclutador){
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Usuario no encontrado' })
        }
        const offers= await this.postulanteModel.find({oferta: {$elemMatch: {reclutadorId: reclutador._id}}}).populate('oferta').populate('userId','name, email, cellphone').exec()
        return offers;

    }
}
export default PostulacionService;