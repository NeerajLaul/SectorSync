import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser"; 
import authRoutes from "./api/auth.js";

dotenv.config();

import questionsRouter from "./api/questions.js";
import answersRouter from "./api/answers.js";
import methodsRouter from "./api/methods.js";
import adminRouter from "./api/admin.js";
import scoringRouter from "./api/scoringEngine.js";
import authRouter from "./api/auth.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors());
app.use(express.json());
app.use(cookieParser());

if (!MONGODB_URI) {
    console.error("❌ ERROR: MONGODB_URI not found in environment variables.");
    process.exit(1);
}

mongoose.connect(MONGODB_URI)
    .then(() => {
        console.log("✅ MongoDB connected successfully.");
        
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`🌐 Access API at: http://localhost:${PORT}/`);
        });
    })
    .catch((err) => {
        console.error("❌ MongoDB connection error:", err.message);
        process.exit(1);
    });

app.use("/api/questions", questionsRouter);
app.use("/api/answers", answersRouter);
app.use("/api/methods", methodsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/scoringEngine", scoringRouter);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
    res.send("Sector Sync Tool API is running successfully with MongoDB 🚀");
});