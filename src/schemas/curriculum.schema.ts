import * as mongoose from 'mongoose';

const CurriculumSchema = new mongoose.Schema({
  studies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Study' }],
  experiences: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Experience' }],
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
  languages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Language' }],
});

export default CurriculumSchema;
