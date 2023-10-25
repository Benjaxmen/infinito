import * as mongoose from 'mongoose';
const DocSchema = new mongoose.Schema({
userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})


export default DocSchema;
