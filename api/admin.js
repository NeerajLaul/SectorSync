import express from "express";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Answer from "../models/Answer.js";
// Assuming these models exist since you said data is in DB
// If they are named differently, please update the import
import Question from "../models/Question.js"; 
import Method from "../models/Method.js";

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_dev_secret";

// --- 🔒 MIDDLEWARE: REQUIRE ADMIN ---
const requireAdmin = async (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user || user.role !== "admin") {
      return res.status(403).json({ error: "Forbidden: Admins only" });
    }
    
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

router.use(requireAdmin);

// --- ROUTES ---

// 1. DASHBOARD SUMMARY
router.get("/summary", async (req, res) => {
  try {
    const [users, answers, questions, methods] = await Promise.all([
      User.countDocuments(),
      Answer.countDocuments(),
      Question.countDocuments(),
      Method.countDocuments()
    ]);

    res.json({
      success: true,
      summary: {
        users_count: users,
        answers_count: answers,
        questions_count: questions,
        methods_count: methods,
      },
    });
  } catch (err) {
    console.error("Summary error:", err);
    res.status(500).json({ error: "Failed to load summary" });
  }
});

// 2. USERS MANAGEMENT
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// 3. ASSESSMENTS (ANSWERS)
router.get("/answers", async (req, res) => {
  try {
    const answers = await Answer.find().sort({ createdAt: -1 });
    const formatted = answers.map(doc => ({
      id: doc.recordId,
      userId: doc.userId || "Anonymous",
      createdAt: doc.createdAt,
      projectName: doc.records?.projectName || "Untitled",
      topMethod: doc.records?.results?.[0]?.method || "Unknown",
      score: doc.records?.results?.[0]?.score || 0,
      fullRecord: doc.records
    }));
    res.json({ success: true, answers: formatted });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch answers" });
  }
});

// 4. GENERIC CRUD FOR QUESTIONS & METHODS (MongoDB)
router.get("/data/:type", async (req, res) => {
    const { type } = req.params;
    try {
        let data;
        if (type === 'questions') data = await Question.find().sort({ id: 1 });
        else if (type === 'methods') data = await Method.find().sort({ name: 1 });
        else return res.status(400).json({ error: "Invalid type" });
        
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: `Failed to fetch ${type}` });
    }
});

router.post("/data/:type", async (req, res) => {
    const { type } = req.params;
    const payload = req.body; // Expects a single object to create or update
    
    try {
        if (type === 'questions') {
            if (payload._id) {
                await Question.findByIdAndUpdate(payload._id, payload);
            } else {
                await Question.create(payload);
            }
        } else if (type === 'methods') {
            if (payload._id) {
                await Method.findByIdAndUpdate(payload._id, payload);
            } else {
                await Method.create(payload);
            }
        } else {
            return res.status(400).json({ error: "Invalid type" });
        }
        res.json({ success: true, message: "Saved successfully" });
    } catch (err) {
        console.error("Save error:", err);
        res.status(500).json({ error: "Failed to save item" });
    }
});

router.delete("/data/:type/:id", async (req, res) => {
    const { type, id } = req.params;
    try {
        if (type === 'questions') await Question.findByIdAndDelete(id);
        else if (type === 'methods') await Method.findByIdAndDelete(id);
        else return res.status(400).json({ error: "Invalid type" });

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete item" });
    }
});

// 5. RESET DB
router.delete("/reset/answers", async (req, res) => {
  try {
    await Answer.deleteMany({});
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Reset failed" });
  }
});

export default router;