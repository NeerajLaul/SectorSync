import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import Answer from "../models/Answer.js";
import { OAuth2Client } from "google-auth-library";
import cookieParser from "cookie-parser";
import axios from "axios"; // Added for GitHub

FRONTEND_URL = "https://sector-sync.vercel.app/"
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "fallback_dev_secret";

// ⬇️ DYNAMIC FRONTEND URL
// On Railway, set FRONTEND_URL to your Vercel link (no trailing slash). 
// Locally, it defaults to localhost:3000.
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

// ⬇️ FIXED COOKIE SETTINGS FOR CROSS-DOMAIN
const setTokenCookie = (res, token) => {
  const isProduction = process.env.NODE_ENV === "production";
  
  res.cookie("token", token, {
    httpOnly: true,
    // CRITICAL: For Vercel -> Railway, we need 'None' so cookies travel across domains
    // Locally ('lax') is better for http://localhost
    sameSite: isProduction ? "none" : "lax", 
    // Secure MUST be true if SameSite is None
    secure: isProduction, 
    maxAge: 7 * 24 * 60 * 60 * 1000, 
  });
};

// --- GOOGLE LOGIN ROUTES ---

// 1. Redirect to Google
router.get("/google", (req, res) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  const url = client.generateAuthUrl({
    access_type: "offline",
    scope: [
      "https://www.googleapis.com/auth/userinfo.profile", 
      "https://www.googleapis.com/auth/userinfo.email"
    ],
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
  });
  res.redirect(url);
});

// 2. Google Callback
router.get("/google/callback", async (req, res) => {
  try {
    const { code } = req.query;
    const client = new OAuth2Client(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_CALLBACK_URL
    );

    // Exchange code for tokens
    const { tokens } = await client.getToken(code);
    client.setCredentials(tokens);

    // Verify ID Token to get user info
    const ticket = await client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const { email, name } = payload;

    // Find or Create User
    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      user = await User.create({ 
        fullName: name, 
        email, 
        password: hashedPassword, 
        company: "Google User" 
      });
    }

    // Issue Cookie
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    setTokenCookie(res, token);
    
    // ⬇️ Redirect to Dynamic URL
    res.redirect(`${FRONTEND_URL}/`); 
  } catch (err) {
    console.error("Google Login Error:", err);
    res.redirect(`${FRONTEND_URL}/signin?error=GoogleLoginFailed`);
  }
});

// --- GITHUB LOGIN ROUTES ---

// 1. Redirect to GitHub
router.get("/github", (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const redirectUri = process.env.GITHUB_CALLBACK_URL;

  const githubAuthUrl =
    `https://github.com/login/oauth/authorize` +
    `?client_id=${clientId}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&scope=read:user user:email`;

  res.redirect(githubAuthUrl);
});

// 2. GitHub Callback
router.get("/github/callback", async (req, res) => {
  try {
    const { code } = req.query;

    // Exchange code for access token (using axios for cleaner syntax)
    const tokenRes = await axios.post("https://github.com/login/oauth/access_token", {
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code,
      redirect_uri: process.env.GITHUB_CALLBACK_URL,
    }, { headers: { Accept: "application/json" } });

    const accessToken = tokenRes.data.access_token;

    // Fetch GitHub profile
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // Fetch GitHub email
    let email = userRes.data.email;
    if (!email) {
       const emailRes = await axios.get("https://api.github.com/user/emails", {
         headers: { Authorization: `Bearer ${accessToken}` }
       });
       const primary = emailRes.data.find(e => e.primary && e.verified);
       email = primary ? primary.email : null;
    }

    const name = userRes.data.name || userRes.data.login;

    // Find or create user in DB
    let user = await User.findOne({ email });
    if (!user) {
      const randomPassword = Math.random().toString(36).slice(-8);
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await User.create({
        fullName: name,
        email,
        password: hashedPassword,
        company: "GitHub User",
      });
    }

    // Issue cookie
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    setTokenCookie(res, token);

    // ⬇️ Redirect to Dynamic URL
    res.redirect(`${FRONTEND_URL}/`);
  } catch (err) {
    console.error("GitHub Login Error:", err);
    res.redirect(`${FRONTEND_URL}/signin?error=GitHubLoginFailed`);
  }
});


// SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password, company } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullName, email, company, password: hashedPassword });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    setTokenCookie(res, token);

    res.json({ success: true, user: { id: user._id, name: user.fullName, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// SIGNIN
router.post("/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });
    setTokenCookie(res, token);

    res.json({ success: true, user: { id: user._id, name: user.fullName, email: user.email } });
  } catch (err) {
    res.status(500).json({ error: "Signin failed" });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  });
  res.json({ success: true });
});

// GET /me
router.get("/me", async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: "Not authenticated" });

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) return res.status(401).json({ error: "User not found" });

    // ⬇️ HISTORY LOGIC
    let history = [];
    if (user.assessments && user.assessments.length > 0) {
      try {
        const records = await Answer.find({ recordId: { $in: user.assessments } });
        history = records.map(rec => {
          const r = rec.records || {};
          const ranking = r.results || [];
          const sorted = [...ranking].sort((a, b) => (b.score || 0) - (a.score || 0));
          const top = sorted[0];

          return {
            id: rec.recordId,
            createdAt: rec.createdAt,
            projectName: r.projectName || "Untitled Project",
            projectDescription: r.projectDescription || "",
            topMethod: top?.method || "Unknown",
            score: Math.round((top?.score || 0) * 100),
            factors: {}, 
            fullResults: { ranking, answers: r.answers }
          };
        });
        history.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } catch (historyErr) {
        console.error("Error fetching user history:", historyErr);
      }
    }

    res.json({ 
        id: user._id, 
        fullName: user.fullName, 
        email: user.email, 
        company: user.company,
        role: user.role,
        history 
    });
  } catch (err) {
    console.error("Auth /me error:", err);
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;

