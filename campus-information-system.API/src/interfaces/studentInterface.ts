import { Document } from "mongoose";

export interface IStudent extends Document {
  StudentStatus: string;
  Strand: string;
  FirstName: string;
  LastName: string;
  MiddleName?: string;
  Gender: 'Male' | 'Female' | 'Prefer not to say';
  DateOfBirth: string; // Format: YYYY-MM-DD
  Age: number;
  GradeLevel: string;
  Section: string;
  Address: string;
  ContactNumber: string;
  Email: string;
  GuardianName: string;
  GuardianContact: string;
}