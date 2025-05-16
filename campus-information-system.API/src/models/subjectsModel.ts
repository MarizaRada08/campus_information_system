// src/model/bookModel.ts
import mongoose, { Document, Schema } from 'mongoose';
import { ISubject } from '../interfaces/subjectsInterface';

interface subjectsInterface extends Document {
  Subject_ID : Number;
  SubjectName : String;
  SubjectDescription : String;
}
const subjectsSchema = new Schema({
  Subject_ID : { type: Number, required: true },
  SubjectName : { type: String, required: true },
  SubjectDescription : { type: String, required: true }
});

export const Subject = mongoose.model<ISubject>('Subject', subjectsSchema);