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
        const user = await this.userModel.findById(offer_data.userId)
        if (!user) {
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
    async delete_offer(offerId){
        try{await this.ofertaModel.findOneAndDelete(offerId)}
        catch(error){throw new NotFoundException("Object not found");}
        return ("Borrado exitoso")
    
    }
    async postulacion(offerId,postulanteId){
        const postulante = await this.userModel.findById(postulanteId)
        if (!postulante) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Este usuario no existe' })
          }
        const oferta = await this.ofertaModel.findById(offerId)
        if (!oferta) {
            throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Esta oferta no existe' })
          }
        const postulacion = await new this.postulanteModel({userId: postulante._id,oferta: oferta._id })
        return postulacion;
    }
    async delete_postulacion(postulacionId){
        try { await this.postulanteModel.findByIdAndDelete(postulacionId);            
        } catch (error) {throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Esta postulación no existe' })}
    }
    
}