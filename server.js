import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; 
import path from "path"; 
import { fileURLToPath } from "url"; 

import authRoutes from "./api/auth.js";
import questionsRouter from "./api/questions.js";
import answersRouter from "./api/answers.js";
import methodsRouter from "./api/methods.js";
import adminRouter from "./api/admin.js";
import scoringRouter from "./api/scoringEngine.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// Helper to get __dirname in ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cookieParser());
app.use(cors()); 

// --- 1. API ROUTES ---
app.use("/api/questions", questionsRouter);
app.use("/api/answers", answersRouter);
app.use("/api/methods", methodsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/scoringEngine", scoringRouter);
app.use("/api/auth", authRoutes);

// --- 2. SERVE FRONTEND (STATIC FILES) ---
// This serves the React app for the root URL "/"
app.use(express.static(path.join(__dirname, "dist")));

// --- 3. CATCH-ALL ROUTE ---
// If the user refreshes on /profile, this sends them back to React
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// --- CONNECT DB & START ---
if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI not found.");
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully.");
        app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });
