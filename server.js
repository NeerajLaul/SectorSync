// server.js
import express from "express";
import fs from "fs";
import path from "path";
import { scoreMethodologies } from "./api/scoringEngine.js";
import answersRouter from "./api/answers.js";   // <-- use the router

const app = express();
app.use(express.json());

// questions CRUD
const filePath = path.join(process.cwd(), "questions.json");

app.get("/api/data", (req, res) => {
  fs.readFile(filePath, "utf-8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ error: "Failed to read data" });
    }
    res.json(JSON.parse(data));
  });
});

app.post("/api/data", (req, res) => {
  fs.writeFile(filePath, JSON.stringify(req.body, null, 2), (err) => {
    if (err) {
      console.error("Error writing file:", err);
      return res.status(500).json({ error: "Failed to save data" });
    }
    res.json({ success: true });
  });
});

// scoring
app.post("/api/scoring", (req, res) => {
  try {
    const result = scoreMethodologies(req.body);
    res.json(result);
  } catch (err) {
    console.error("Error scoring methodologies:", err);
    res.status(500).json({ error: "Failed to score methodologies" });
  }
});

// answers (mounted router)  ✅ single source of truth
app.use("/api/answers", answersRouter);

app.listen(5000, () => console.log("✅ Server running at http://localhost:5000"));
