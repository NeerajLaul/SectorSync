import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  id: { type: String, required: true },        // project_size-opt1
  text: { type: String, required: true },      // Small
  description: { type: String },               // optional sentence
  factorValue: { type: String },               // can be "", same as frontend
});

const QuestionSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },     // project_size
    question: { type: String, required: true },             // full question text
    description: { type: String },                          // optional
    options: [OptionSchema],                                // array of options
  },
  { timestamps: true }
);

export default mongoose.models.Question ||
  mongoose.model("Question", QuestionSchema);
