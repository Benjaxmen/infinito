import * as mongoose from 'mongoose';

const DescripcionSchema = new mongoose.Schema({
    descripcion: {type: String, required:true}
});
export default DescripcionSchema