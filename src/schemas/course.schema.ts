import { Schema } from 'mongoose';

const CourseSchema = new Schema({
    name: { type: String, required: true },
    institution: { type: String, required: true },
    completionDate: { type: Date, required: true },
    description: { type: String },
});

export default CourseSchema;
