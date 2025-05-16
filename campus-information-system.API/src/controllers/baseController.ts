import { Request, Response } from "express";
import { Model, Document, Types } from "mongoose";

export class BaseController<T extends Document> {
  protected model: Model<T>;
  protected searchableFields: string[];
  protected populateFields?: { path: string; select?: string }[];

  constructor(model: Model<T>, populateFields?: { path: string; select?: string }[]) {
    this.model = model;
    this.populateFields = populateFields;

    // Automatically detect searchable string fields
    this.searchableFields = Object.keys(model.schema.paths).filter(
      (key) => model.schema.paths[key].instance === "String"
    );
  }

  // Create a new document
  public async create(req: Request, res: Response): Promise<void> {
    try {
      const newItem = await this.model.create(req.body);
      res.status(201).json(newItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

// Read all documents with dynamic filtering, searching, sorting, pagination & population
public async read(req: Request, res: Response): Promise<void> {
  try {
    const { search, page = 1, limit = 10, sortBy = "createdAt", order = "desc", ...filters } = req.query;

    const filter: any = {};

    // Querying by specific fields (case-insensitive search)
    for (const key in filters) {
      if (filters[key]) {
        filter[key] = { $regex: new RegExp(filters[key] as string, "i") };
      }
    }

    // Full-Text Search on ALL string fields (Auto-detected)
    if (search && this.searchableFields.length > 0) {
      filter.$or = this.searchableFields.map((field) => ({
        [field]: { $regex: new RegExp(search as string, "i") },
      }));
    }

    // Sorting & Pagination
    let query = this.model
      .find(filter)
      .sort({ [sortBy as string]: order === "desc" ? -1 : 1 })
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    // Apply population if defined
    if (this.populateFields) {
      query = query.populate(this.populateFields);
    }

    const items = await query;
    res.status(200).json(items);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
}

// Read a single document by ID with population
public async readById(req: Request, res: Response): Promise<void> {
  try {
    const { id } = req.params;

    if (!Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Invalid ID format" });
      return;
    }

    let query = this.model.findById(id);

    // Apply population if defined
    if (this.populateFields) {
      query = query.populate(this.populateFields);
    }

    const item = await query;
    if (!item) {
      res.status(404).json({ message: "Not found" });
      return;
    }
    res.status(200).json(item);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
}


  // Update a document by ID
  public async update(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid ID format" });
        return;
      }

      const updatedItem = await this.model.findByIdAndUpdate(id, req.body, { new: true });
      if (!updatedItem) {
        res.status(404).json({ message: "Not found" });
        return;
      }
      res.status(200).json(updatedItem);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  }

  // Delete a document by ID
  public async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // Ensure the ID is valid before querying the database
      if (!Types.ObjectId.isValid(id)) {
        res.status(400).json({ message: "Invalid ID format" });
        return;
      }

      const deletedItem = await this.model.findByIdAndDelete(id);
      if (!deletedItem) {
        res.status(404).json({ message: "Not found" });
        return;
      }

      res.status(200).json({ message: "Deleted successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  }
}