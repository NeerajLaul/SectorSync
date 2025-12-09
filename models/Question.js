import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  value: { type: String, required: true }, // e.g., "Agile", "Waterfall"
});

const QuestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true }, // e.g. "q1"
    text: { type: String, required: true },
    category: { type: String, default: "General" },
    options: [OptionSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Question || mongoose.model("Question", QuestionSchema);