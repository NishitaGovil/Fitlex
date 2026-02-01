const express = require("express");
const path = require("path");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = 3000;

// ================== CONFIG ================== //
const JWT_SECRET = "fitlex_jwt_secret";

// ================== MIDDLEWARE ================== //
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static files
app.use(express.static(path.join(__dirname, "public")));

// ================== AUTH MIDDLEWARE ================== //
function isAuthenticated(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.redirect("/login");
  }
}

// ================== ROUTES ================== //

// 🏠 HOME
app.get("/", (req, res) => {
  res.render("home");
});

// 🔐 LOGIN PAGE
app.get("/login", (req, res) => {
  res.render("login");
});

// 📝 SIGNUP PAGE
app.get("/signup", (req, res) => {
  res.render("signup");
});

// ================== AUTH HANDLERS ================== //

// LOGIN
app.post("/login", (req, res) => {
  const { email } = req.body;

  // Later: validate user from DB
  const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, { httpOnly: true });
  res.redirect("/profile");
});

// SIGNUP
app.post("/signup", (req, res) => {
  const { name, email } = req.body;

  // Later: save user to DB
  const token = jwt.sign({ name, email }, JWT_SECRET, { expiresIn: "1h" });

  res.cookie("token", token, { httpOnly: true });
  res.redirect("/profile");
});

// ================== PROFILE ================== //
app.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.user });
});

// ================== GENERATE PLAN ================== //
app.post("/generate-plan", isAuthenticated, (req, res) => {
  const { fullName, ageGroup, sex, height, weight, goal } = req.body;

  // Merge profile data into JWT
  const updatedUser = {
    ...req.user,
    fullName,
    ageGroup,
    sex,
    height,
    weight,
    goal
  };

  const token = jwt.sign(updatedUser, JWT_SECRET, { expiresIn: "1h" });
  res.cookie("token", token, { httpOnly: true });

  // AI will be added later
  res.redirect("/dashboard");
});

// ================== DASHBOARD ================== //
app.get("/dashboard", isAuthenticated, (req, res) => {
  res.render("dashboard", { user: req.user });
});

// ================== LOGOUT ================== //
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// ================== SERVER ================== //
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
