// api/methods.js
import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const methodsFile = path.join(process.cwd(), "data/methods.json");

const readMethods = () => {
  const raw = fs.readFileSync(methodsFile, "utf-8");
  const json = JSON.parse(raw || "{}");
  return Object.entries(json).map(([name, attrs]) => ({ name, ...attrs }));
};

const writeMethods = (arr) => {
  const obj = {};
  arr.forEach((m) => {
    const { name, ...attrs } = m;
    if (name) obj[name] = attrs;
  });
  fs.writeFileSync(methodsFile, JSON.stringify(obj, null, 2));
};

router.get("/", (req, res) => res.json(readMethods()));

router.post("/", (req, res) => {
  try {
    const arr = req.body;
    if (!Array.isArray(arr)) return res.status(400).json({ error: "Expected array" });
    writeMethods(arr);
    res.json({ success: true, message: "Methods saved" });
  } catch (err) {
    res.status(500).json({ error: "Failed to save methods" });
  }
});

export default router;
