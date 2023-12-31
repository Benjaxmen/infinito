import * as mongoose from 'mongoose';

const OfertaSchema = new mongoose.Schema({
    posicion: {type: String, required: true},
    descripcion: {type: String, required:true},
    empresa: {type:String, required: true},
    renta:{type: Number},
    tags:[{type: String}],
    fecha_publicacion:{type: Date, default: Date.now},
    reclutadorId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
    
});
export default OfertaSchema