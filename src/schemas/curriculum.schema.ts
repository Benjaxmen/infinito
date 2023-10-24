import * as mongoose from 'mongoose';

const CurriculumSchema = new mongoose.Schema({
  studies: [
    {
      name: { type: String, required: true },
      type: { type: String, required: true },
      institution: { type: String, required: true },
      admissionDate: { type: Date, required: true },
      graduationDate: { type: Date, required: true },
      description: { type: String },
    },
  ],
  experiences: [
    {
      position: { type: String, required: true },
      company: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      description: { type: String },
    },
  ],
  courses: [
    {
      name: { type: String, required: true },
      institution: { type: String, required: true },
      completionDate: { type: Date, required: true },
      description: { type: String },
    },
  ],
  languages: [
    {
      name: { type: String, required: true },
      level: { type: String, required: true },
    },
  ],
});

export default CurriculumSchema;
