import * as mongoose from 'mongoose';
import PostulanteSchema from '../schemas/postulante.schema';
import UserSchema from '../schemas/user.schema';
import OfertaSchema from '../schemas/oferta.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
class PostulacionService{
    private userModel = mongoose.model("User",UserSchema);
    private ofertaModel = mongoose.model("Oferta",OfertaSchema);
    private postulanteModel = mongoose.model("Postulante",PostulanteSchema);
    async create_offer(userId, offer_data ){

    }
    
}