import { Schema } from 'mongoose';

const LanguageSchema: Schema = new Schema({
    name: { type: String, required: true },
    level: { type: String, required: true },
});

export default LanguageSchema;
