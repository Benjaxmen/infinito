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
  curriculum: {type: mongoose.Schema.Types.ObjectId, ref: 'Curriculum'},
  descripcion: {type:mongoose.Schema.Types.ObjectId, ref: 'Descripcion'},
  //application: {type: mongoose.Schema.Types.ObjectId, ref: 'Application'},
});

export default UserSchema;
