
const mongoose = require("mongoose");
const User = require("./models/User"); // Make sure this path is correct
/* ---------------- DATABASE CONNECTION ---------------- */
mongoose
  .connect("mongodb://127.0.0.1:27017/fitlexDB")
  .then(() => console.log("✅✅✅ DATABASE CONNECTED SUCCESSFULLY!"))
  .catch((err) => console.error("❌❌❌ DATABASE CONNECTION FAILED:", err));

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
app.post("/signup", async (req, res) => {
  console.log("Data received from form:", req.body); // This will now show up!
  try {
    const { name, email, password } = req.body;

    // 1. Save the user to MongoDB
    // This uses the 'User' model you imported at the top
    const newUser = await User.create({ 
      name: name, 
      email: email, 
      password: password 
    });

    console.log("✅ User created in MongoDB:", newUser);

    // 2. Generate the token using the newly created User's ID
    const token = jwt.sign(
      { name: newUser.name, email: newUser.email, id: newUser._id }, 
      JWT_SECRET, 
      { expiresIn: "1h" }
    );

    // 3. Set cookie and send them to the profile
    res.cookie("token", token, { httpOnly: true });
    res.redirect("/profile");

  } catch (err) {
    console.error("❌ Signup Database Error:", err.message);
    
    // If the email already exists, MongoDB throws error 11000
    if (err.code === 11000) {
      return res.status(400).send("Email already registered. Please login.");
    }
    
    res.status(500).send("Error saving to database.");
  }
});

// ================== PROFILE ================== //
app.get("/profile", isAuthenticated, (req, res) => {
  res.render("profile", { user: req.user });
});

// ================== GENERATE PLAN ================== //
app.post("/generate-plan", isAuthenticated, async (req, res) => {
  try {
    // 1. Pull the data from the form
    const { fullName, dob, ageGroup, sex, height, weight, goal } = req.body;

    // 2. Update the user in the database
    // req.user.id comes from the JWT token we made during signup
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id, 
      { 
        fullName, 
        dob, 
        ageGroup, 
        sex, 
        height, 
        weight, 
        fitnessGoal: goal // mapping 'goal' from form to 'fitnessGoal' in DB
      }, 
      { new: true } // This returns the updated version of the user
    );

    console.log("✅ Profile Updated in DB for:", updatedUser.email);

    // 3. Update the Cookie so the Dashboard shows the new info immediately
    const token = jwt.sign(
      { 
        id: updatedUser._id, 
        name: updatedUser.name, 
        email: updatedUser.email,
        fullName: updatedUser.fullName,
        goal: updatedUser.fitnessGoal 
      }, 
      JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });
    res.redirect("/dashboard");

  } catch (err) {
    console.error("❌ Error updating profile:", err.message);
    res.status(500).send("Failed to save profile details.");
  }
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


