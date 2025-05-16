import Joi from "joi";
import { Request, Response, NextFunction } from "express";

// Updated schema to match the new student data structure
const StudentValidationSchema = Joi.object({
  StudentStatus: Joi.string().max(50).required().messages({
    "string.max": "StudentStatus cannot exceed 50 characters",
    "any.required": "StudentStatus is required",
  }),
  Strand: Joi.string().max(50).required().messages({
    "string.max": "Strand cannot exceed 50 characters",
    "any.required": "Strand is required",
  }),
  FirstName: Joi.string().max(50).required().messages({
    "string.max": "First name cannot exceed 50 characters",
    "any.required": "First name is required",
  }),
  LastName: Joi.string().max(50).required().messages({
    "string.max": "Last name cannot exceed 50 characters",
    "any.required": "Last name is required",
  }),
  MiddleName: Joi.string().max(50).optional().messages({
    "string.max": "Middle name cannot exceed 50 characters",
  }),
  Gender: Joi.string().valid("Male", "Female", "Prefer not to say").required().messages({
    "any.required": "Gender is required",
    "string.base": "Gender must be a string",
    "any.only": "Gender must be 'Male', 'Female', or 'Prefer not to say'",
  }),
  DateOfBirth: Joi.date().iso().required().messages({
    "date.format": "Date of Birth must be in the format YYYY-MM-DD",
    "date.base": "Date of Birth must be a valid date",
    "any.required": "Date of Birth is required",
  }),
  Age: Joi.number().min(0).required().messages({
    "number.base": "Age must be a number",
    "number.min": "Age must be a positive number",
    "any.required": "Age is required",
  }),
  GradeLevel: Joi.string().max(20).required().messages({
    "string.base": "Grade Level must be a string",
    "string.max": "Grade Level cannot exceed 20 characters",
    "any.required": "Grade Level is required",
  }),
  Section: Joi.string().max(20).required().messages({
    "string.base": "Section must be a string",
    "string.max": "Section cannot exceed 20 characters",
    "any.required": "Section is required",
  }),
  Address: Joi.string().max(255).required().messages({
    "string.max": "Address cannot exceed 255 characters",
    "any.required": "Address is required",
  }),
  ContactNumber: Joi.string().pattern(/^\d+$/).required().messages({
    "string.pattern.base": "Contact Number must be a valid numeric string",
    "any.required": "Contact Number is required",
  }),
  Email: Joi.string().email().required().messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email is required",
  }),
  GuardianName: Joi.string().max(100).required().messages({
    "string.max": "Guardian Name cannot exceed 100 characters",
    "any.required": "Guardian Name is required",
  }),
  GuardianContact: Joi.string().pattern(/^\d+$/).required().messages({
    "string.pattern.base": "Guardian Contact must be a valid numeric string",
    "any.required": "Guardian Contact is required",
  }),
});

// Helper function to validate student data
export const validateStudentData = (data: any) => {
  return StudentValidationSchema.validate(data, { abortEarly: false });
};

// Middleware to validate student data
export const validateStudentMiddlewareV2 = (req: Request, res: Response, next: NextFunction) => {
  const { error } = validateStudentData(req.body);

  if (error) {
    return res.status(400).json({
      message: "Validation error",
      errors: error.details.map((err) => ({
        field: err.path.join("."),
        message: err.message,
      })),
    });
  }

  next();
};
