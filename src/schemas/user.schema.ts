import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
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
});

UserSchema.methods.validatePassword = async function(password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

export default UserSchema;
