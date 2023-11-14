import * as mongoose from 'mongoose';
import UserSchema from '../schemas/user.schema';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { isEmail } from 'validator';
import * as bcrypt from 'bcrypt';
import DescripcionSchema from '../schemas/descripcion.schema';
import MediaSchema from 'src/schemas/media.schema';
import DocSchema from 'src/schemas/doc.schema';
import OfertaSchema from 'src/schemas/oferta.schema';
class UserService {
  private userModel = mongoose.model('User', UserSchema);
  private descriptionModel = mongoose.model('Description',DescripcionSchema)
  private mediaModel = mongoose.model('Media',MediaSchema)
  private docModel = mongoose.model('Doc',DocSchema)
  private ofertaModel = mongoose.model('Offer',OfertaSchema)
  
  
  async create(userData) {
    const existingUser = await this.userModel.findOne({ email: userData.email });
    if (existingUser) {
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Ese correo electrónico ya está asociado a una cuenta' })
    }
    if(!isEmail(userData.email)){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Ingresa un correo electrónico válido' })

    }
    if(!userData.name || !userData.password || !userData.dateofbirth || !userData.profession || !userData.rut || !userData.cellphone){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Ingresa datos válidos' })
    }
    userData.password =await this.hashPassword(userData.password)
    userData.rol="Usuario"
    

    const user = new this.userModel(userData);
    await user.save();
    return user.id;
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // Number of salt rounds (higher is more secure but slower)

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    return hashedPassword;
  }

  async validatePassword(userId,password: string){
    const user=await this.userModel.findOne({_id: userId});
    const result=await bcrypt.compare(password,user.password);
    return result;

  }

  async findAll() {
    const users = await this.userModel.find();
    return users;
  }

  async find_page(page: number, pagesize: number){
    const skip =(page-1)*pagesize
    const users = await this.userModel.find().skip(skip).limit(pagesize).exec()
    return users
  }
  async findOne(filter: Record<string, any>) {
    const user = await this.userModel.findOne(filter);
    return user;
  }
  async findOnebyId(userId){
    if (!mongoose.Types.ObjectId.isValid(userId)){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
  }
    const user = await this.userModel.findById(userId);
    if (!user){throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Usuario no encontrado' })

    }
    return user;

  }
  async read(userId) {
    const user = await this.userModel.findOne({_id: userId});
    if(!user){
      throw new NotFoundException('Usuario no encontrado');


    }
    return {nombre: user.name, rut: user.rut,correo: user.email,nacimiento: user.dateofbirth, prof: user.profession,cel: user.cellphone,id: user._id, foto: user.media, desc:user.descripcion,pdf:user.doc};
  }

  async update(userId, newUserData) {
    if (!mongoose.Types.ObjectId.isValid(userId)){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
  }
    const user = await this.userModel.findByIdAndUpdate(userId, newUserData, { new: true });
    const payload2={id: user._id, email: user.email, name: user.name,rol:user.rol,dob:user.dateofbirth,profession:user.profession,rut:user.rut,cellphone:user.cellphone}
    
    return payload2;
  }

  async delete(userId) {
    const user = await this.userModel.findByIdAndDelete(userId);
    return user;
  }
  async findAll_desc() {
    const users = await this.descriptionModel.find();
    return users;
  }
  async create_description(userId: string, description: string ){
  const user = await this.userModel.findById(userId);
  if (!user) {
    throw new NotFoundException('Usuario no encontrado');
  }
  const descrip= new this.descriptionModel(description);
  await descrip.save();
  await this.userModel.findByIdAndUpdate(userId, { $set: { descripcion: descrip._id } });
    return { descripId: descrip._id, userId: userId}
    

  }
  async historial_usuario(userId){
    if (!mongoose.Types.ObjectId.isValid(userId)){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
  }
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return user.historial

  }
  async update_historial(userId,offerId){
    if (!mongoose.Types.ObjectId.isValid(userId)){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'UserId no válido' })
  }
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    if (!mongoose.Types.ObjectId.isValid(offerId)){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'OfferId no válido' })
  }
  const offer = await this.ofertaModel.findById(offerId);
    if (!offer) {
      throw new NotFoundException('oferta no encontrada');
    }



  }
  async update_description(userId: string,  newDesc: any) {
    if (!mongoose.Types.ObjectId.isValid(userId)){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
  }
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const descripcionId = user.descripcion;

    const descripcion = await this.descriptionModel.findByIdAndUpdate(descripcionId,newDesc, { new: true });
    return descripcion;
  }
  async add_media(userId:string){
    if (!mongoose.Types.ObjectId.isValid(userId)){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
  }
    const user =await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const media= new this.mediaModel()
  await media.save()
  await this.userModel.findByIdAndUpdate(userId, { $set: { media: media._id } })
  return media._id;
  }
  async add_doc(userId:string){
    if (!mongoose.Types.ObjectId.isValid(userId)){
      throw new BadRequestException('Algo salió mal', { cause: new Error(), description: 'Id no válido' })
  }
    const user =await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    const doc= new this.docModel()
  await doc.save()
  await this.userModel.findByIdAndUpdate(userId, { $set: { doc: doc._id } })
  return doc._id;

  }
}


export default UserService;
