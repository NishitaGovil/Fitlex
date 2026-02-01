const express = require("express");
const session = require("express-session");
const path = require("path");

const app = express();

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: "fitlex_secret_key",
  resave: false,
  saveUninitialized: true
}));

// View Engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Static Folder
app.use(express.static(path.join(__dirname, "public")));


// ================== ROUTES ================== //

// 🏠 1. HOME PAGE
app.get("/", (req, res) => {
  res.render("home");
});

// LOGIN PAGE
app.get("/login", (req, res) => {
  res.render("login");
});

// SIGNUP PAGE
app.get("/signup", (req, res) => {
  res.render("signup");
});


// 📝 3. HANDLE LOGIN/SIGNUP
app.post("/login", (req, res) => {
  const { email } = req.body;
  req.session.user = { email };

  res.redirect("/profile");   // 
});

app.post("/signup", (req, res) => {
  const { email } = req.body;
  req.session.user = { email };

  res.redirect("/profile");   // 
});




// 👤 4. PROFILE SETUP PAGE
app.get("/profile", (req, res) => {
  if (!req.session.user) return res.redirect("/login");
  res.render("profile");   // matches profile.ejs
});



// ⚡ 5. GENERATE PLAN BUTTON (redirect to dashboard)
app.post("/generate-plan", (req, res) => {
  const { name, age, goal } = req.body;

  // Merge profile data with existing session user
  req.session.user = {
    ...req.session.user,
    name,
    age,
    goal
  };

  // Later AI will generate plan here

  res.redirect("/dashboard");
});


// 📊 6. DASHBOARD
app.get("/dashboard", (req, res) => {
  if (!req.session.user) return res.redirect("/auth");

  res.render("dashboard", { user: req.session.user });
});


// 🚪 7. LOGOUT
app.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
});


// Server Start
app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
