import * as mongoose from 'mongoose';
const MediaSchema = new mongoose.Schema({
userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
})


export default MediaSchema;
