// models/User.js
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // will be hashed
    company: { type: String },
    assessments: { type: [String], default: [] },
    role: { type: String, enum: ["user", "admin"], default: "user" },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", UserSchema);