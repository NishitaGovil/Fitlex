// ================== IMPORTS ================== //
require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const profileRoutes = require("./routes/profileRoutes");
const aiRoutes = require("./routes/aiRoutes");

const jwt = require("jsonwebtoken");

// ================== APP SETUP ================== //
const app = express();
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// EJS view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ================== JWT AUTH MIDDLEWARE ================== //
function isAuthenticated(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
}

// ================== BASIC ROUTES ================== //
// Home
app.get("/", (req, res) => {
  res.render("home");
});

// Login & Signup pages
app.get("/login", (req, res) => res.render("login"));
app.get("/signup", (req, res) => res.render("signup"));

// Profile page (protected)
app.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.user });
});

// Generate Plan (update JWT with user info)
app.post("/generate-plan", isAuthenticated, (req, res) => {
  const { fullName, ageGroup, sex, height, weight, goal } = req.body;

  const updatedUser = {
    ...req.user,
    fullName,
    ageGroup,
    sex,
    height,
    weight,
    goal
  };

  if (updatedUser.exp) delete updatedUser.exp;

  const token = jwt.sign(updatedUser, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.cookie("token", token, { httpOnly: true });

  res.redirect("/dashboard");
});

// Dashboard (protected)
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user });
});

// Logout
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// ================== ROUTES ================== //
app.use(authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/', aiRoutes);

// ================== START SERVER ================== //
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
