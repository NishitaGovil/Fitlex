const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

/* ---------------- MIDDLEWARE ---------------- */

// To read form data (VERY IMPORTANT)
app.use(express.urlencoded({ extended: true }));

// To serve CSS, images, JS
app.use(express.static(path.join(__dirname, "public")));

/* ---------------- VIEW ENGINE ---------------- */

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

/* ---------------- ROUTES ---------------- */

// Home (optional)
app.get("/", (req, res) => {
  res.render("home"); // home.ejs
});


// Login page
app.get("/login", (req, res) => {
  res.render("login");
});

// Signup page
app.get("/signup", (req, res) => {
  res.render("signup");
});

// Profile setup page
app.get("/profile", (req, res) => {
  res.render("profile");
});

/* 🔥 THIS IS THE ROUTE YOU WERE MISSING */
app.post("/generate-plan", (req, res) => {
  console.log("Form Data Received:", req.body);

  const { name, dob, ageGroup, sex, height, weight, goal } = req.body;

  
  res.send(`
    <h1>Plan Generated Successfully ✅</h1>
    <p>Name: ${name}</p>
    <p>Age Group: ${ageGroup}</p>
    <p>Goal: ${goal}</p>
    <a href="/profile">Go Back</a>
  `);
});



app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
