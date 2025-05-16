import { Document } from "mongoose";

export interface IEnrollment extends Document {
    Enrollment_ID: number;
    Student_ID: number;
    EnrollmentDate: Date;
}