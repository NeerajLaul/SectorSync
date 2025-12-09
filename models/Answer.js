// models/Answer.js
import mongoose from "mongoose";

const AnswerSchema = new mongoose.Schema(
  {
    recordId: {
      type: String,
      required: true,
      unique: true,
    },
    records: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

const Answer =
  mongoose.models.Answer || mongoose.model("Answer", AnswerSchema);

export default Answer;
