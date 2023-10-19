import { Schema } from 'mongoose';

const StudySchema = new Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    institution: { type: String, required: true },
    admissionDate: { type: Date, required: true },
    graduationDate: { type: Date, required: true },
    description: { type: String },
});

export default StudySchema;
