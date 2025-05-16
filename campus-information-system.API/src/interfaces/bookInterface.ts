import mongoose, { Document } from "mongoose";

export interface IBook extends Document {
  Book_ID : Number;
  Student_ID : Number;
  Title : String; 
  Author : String;
  Publisher : String;
  Year_of_Publication : Date;
  Available_Copies : Number;
  Total_Copies : Number;
  Category_ID : mongoose.Types.ObjectId;
  Shelf_ID : Number;
}
