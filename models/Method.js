import mongoose from "mongoose";

const MethodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    description: { type: String },
    attributes: { 
      type: Map, 
      of: String 
    }, 
  },
  { timestamps: true }
);

export default mongoose.models.Method || mongoose.model("Method", MethodSchema);