import * as mongoose from 'mongoose';
const ExperienceSchema = new mongoose.Schema({
userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
position: { type: String, required: true },
company: { type: String, required: true },
startDate: { type: Date, required: true },
endDate: { type: Date, required: true },
description: { type: String },
})


export default ExperienceSchema;
