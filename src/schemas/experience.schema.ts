import { Schema } from 'mongoose';

const ExperienceSchema = new Schema({
    position: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    description: { type: String },
});

export default ExperienceSchema;
