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
  description: { type: String },
  skill: { type: String },
  };
  
  const DescriptionSchema = new mongoose.Schema({
  description: { type: String },
  });
  
  const LanguageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  level: { type: String, required: true },
  });
  
  const CourseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  institution: { type: String, required: true },
  completionDate: { type: Date, required: true },
  description: { type: String },
  });
  
  const ExperienceSchema = new mongoose.Schema({
  position: { type: String, required: true },
  company: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String },
  });
  
  const SkillSchema = new mongoose.Schema({
  skill: { type: String },
  });
  
  const StudySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true },
  institution: { type: String, required: true },
  admissionDate: { type: Date, required: true },
  graduationDate: { type: Date, required: true },
  description: { type: String },
  });
  
  const CurriculumSchema = new mongoose.Schema({
  curriculum: { type: CurriculumSchema },
  description: { type: DescriptionSchema },
  languages: { type: [LanguageSchema] },
  courses: { type: [CourseSchema] },
  experiences: { type: [ExperienceSchema] },
  skills: { type: [SkillSchema] },
  studies: { type: [StudySchema] },
  });
});

export default CurriculumSchema;
