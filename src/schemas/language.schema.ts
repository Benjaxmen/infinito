import * as mongoose from 'mongoose';
const LanguageSchema = new mongoose.Schema({
userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
name: { type: String, required: true },
level: { type: String, required: true },
})


export default LanguageSchema;
