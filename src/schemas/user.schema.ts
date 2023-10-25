import * as mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true},
  name: { type: String, required: true },
  rol: {type: String, default:'Usuario'},
  password: { type: String, required: true },
  dateofbirth: { type: Date, required: true },
  dateOfRegistry: { type: Date, default: Date.now },
  profession: { type: String, required: true },
  rut: { type: String, required: true },
  cellphone: { type: String, required: true },
  descripcion: {type:mongoose.Schema.Types.ObjectId, ref: 'Descripcion'},
  media:{type:mongoose.Schema.Types.ObjectId, ref: 'Media'},
  doc: {type:mongoose.Schema.Types.ObjectId, ref: 'Media'}
  //application: {type: mongoose.Schema.Types.ObjectId, ref: 'Application'},
});

export default UserSchema;
