import { Request, Response } from "express";
import { Enrollment } from "../models/enrollmentModel";
import { IEnrollment } from "../interfaces/enrollmentInterface";
import { validateEnrollmentData } from "../validations/enrollmentValidation";
import { BaseController } from "../controllers/baseController";

export class EnrollmentController extends BaseController<IEnrollment> {
  updateEnrollment(arg0: string, authMiddleware: (req: Request, res: Response, next: import("express").NextFunction) => Response<any, Record<string, any>> | undefined, updateEnrollment: any) {
      throw new Error("Method not implemented.");
  }
  constructor() {
    super(Enrollment);
  }

  // Create a new Enrollment with validation
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateEnrollmentData(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((err) => err.message) });
        return;
      }
      req.body = payload; // Ensure validated payload is used
      await super.create(req, res);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Update an existing Enrollment with validation
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { error, value: payload } = validateEnrollmentData(req.body);
      if (error) {
        res.status(400).json({ message: error.details.map((err) => err.message) });
        return;
      }
      req.body = payload; // Ensure validated payload is used
      await super.update(req, res);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  public async read(req: Request, res: Response): Promise<void> {
    try {
      const { sort } = req.query;

      // Default sorting (walang sorting)
      let sortQuery: Record<string, 1 | -1> = {};

      if (sort) {
        const [field, order] = (sort as string).split("_");

        // Siguruhing valid ang field name
        const validFields = ["EnrollmentDate", "Student_ID", "Course_ID"];
        if (validFields.includes(field)) {
          sortQuery[field] = order === "asc" ? 1 : -1;
        }
      }

      // Debugging logs
      console.log("Sort Query:", sortQuery);

      // Fetch sorted enrollments
      const enrollments = await Enrollment.find().sort(sortQuery);

      res.json({ success: true, data: enrollments });
    } catch (error: any) {
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }
}
