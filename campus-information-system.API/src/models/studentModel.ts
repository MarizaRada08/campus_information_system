import mongoose, { Document, Schema } from 'mongoose';
import { IStudent } from '../interfaces/studentInterface';


export interface studentInterface extends Document {
  StudentStatus: string;
  Strand: string;
  FirstName: string;
  LastName: string;
  MiddleName?: string;
  Gender: 'Male' | 'Female' | 'Prefer not to say';
  DateOfBirth: Date; // Stored as Date in DB
  Age: number;
  GradeLevel: string;
  Section: string;
  Address: string;
  ContactNumber: string;
  Email: string;
  GuardianName: string;
  GuardianContact: string;
}

const studentSchema = new Schema<IStudent>({
  StudentStatus: { type: String, required: true },
  Strand: { type: String, required: true },
  FirstName: { type: String, required: true },
  LastName: { type: String, required: true },
  MiddleName: { type: String }, // Optional
  Gender: { type: String, enum: ['Male', 'Female', 'Prefer not to say'], required: true },
  DateOfBirth: { type: String, required: true },
  Age: { type: Number, required: true },
  GradeLevel: { type: String, required: true },
  Section: { type: String, required: true },
  Address: { type: String, required: true },
  ContactNumber: { type: String, required: true },
  Email: {
    type: String,
    required: true,
    unique: true,
  },
  GuardianName: { type: String, required: true },
  GuardianContact: { type: String, required: true },
});

export const Student = mongoose.model<IStudent>('Student', studentSchema);
