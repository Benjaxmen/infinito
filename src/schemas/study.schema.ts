import * as mongoose from 'mongoose';
const StudySchema = new mongoose.Schema({
userId: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
name: { type: String, required: true },
    type: { type: String, required: true },
    institution: { type: String, required: true },
    admissionDate: { type: Date, required: true },
    graduationDate: { type: Date, required: true },
    description: { type: String },

})


export default StudySchema;
