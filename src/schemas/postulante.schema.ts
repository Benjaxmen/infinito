import * as mongoose from 'mongoose';
const PostulanteSchema = new mongoose.Schema({
userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
oferta: {type: mongoose.Schema.Types.ObjectId, ref: 'Oferta'},
fecha_postulacion: {type: Date,default: Date.now },
estado:{type: String, required: true}
})


export default PostulanteSchema;