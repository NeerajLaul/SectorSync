import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"; 
import authRoutes from "./api/auth.js";

dotenv.config();

import questionsRouter from "./api/questions.js";
import answersRouter from "./api/answers.js";
import methodsRouter from "./api/methods.js";
import adminRouter from "./api/admin.js";
import scoringRouter from "./api/scoringEngine.js";

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

// ⬇️ THE FIX: Specific Origins + Credentials
app.use(cors({
  origin: [
    "http://localhost:3000",                // Localhost
    "https://sector-sync.vercel.app"        // Your Vercel Domain
  ],
  credentials: true, // Required for cookies to work
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
}));

app.use(express.json());
app.use(cookieParser());

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

app.use("/api/questions", questionsRouter);
app.use("/api/answers", answersRouter);
app.use("/api/methods", methodsRouter);
app.use("/api/admin", adminRouter);
app.use("/api/scoringEngine", scoringRouter);
app.use("/api/auth", authRoutes);

app.get("/", (req, res) => res.send("API Running"));
