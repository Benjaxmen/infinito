import * as mongoose from 'mongoose';
const CourseSchema = new mongoose.Schema({
userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
name: { type: String, required: true },
institution: { type: String, required: true },
completionDate: { type: Date, required: true },
description: { type: String },
})


export default CourseSchema;
