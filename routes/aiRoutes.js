// ================== aiRoutes.js ================== //
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const { OpenAI } = require("openai");

// ================== AUTH MIDDLEWARE ================== //
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

// ================== OPENAI SETUP ================== //
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// ================== GENERATE AI WEEKLY PLAN ================== //
router.get("/ai-plan", isAuthenticated, async (req, res) => {
  try {
    const { ageGroup, sex, height, weight, goal } = req.user;

    // Chat prompt to generate weekly plan
    const prompt = `
      Generate a 7-day workout plan for a ${ageGroup} ${sex}, ${height}cm, ${weight}kg, 
      with the goal: ${goal}. Include daily workout name and 3 exercises per day. 
      Return output as JSON array with fields: day, workout, exercises (array), motivation.
    `;

    // Request AI
    const response = await openai.chat.completions.create({
      model:  "gpt-4o-mini",

      messages: [
        { role: "system", content: "You are a helpful fitness AI assistant." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7
    });

    // Parse AI response (assume JSON)
    let weeklyPlan;
    try {
      weeklyPlan = JSON.parse(response.choices[0].message.content);
    } catch (err) {
      console.log("AI JSON parse error, using fallback plan");
      throw new Error("AI parsing failed");
    }

    res.render("aiDashboard", { weeklyPlan, user: req.user });

  } catch (err) {
    console.log("AI Error:", err.message);

    // Fallback plan if AI fails
    const fallbackPlan = [
      { day: "Day 1", workout: "Chest & Triceps (High)", exercises: ["Push-ups", "Bench Press", "Tricep Dips"], motivation: "Keep pushing!" },
      { day: "Day 2", workout: "Back & Biceps (High)", exercises: ["Pull-ups", "Deadlifts", "Bicep Curls"], motivation: "Strong back, strong you!" },
      { day: "Day 3", workout: "Legs (High)", exercises: ["Squats", "Lunges", "Leg Press"], motivation: "Leg day, let's go!" },
      { day: "Day 4", workout: "Shoulders & Abs (High)", exercises: ["Shoulder Press", "Plank", "Crunches"], motivation: "Abs and shoulders!" },
      { day: "Day 5", workout: "Full Body HIIT (High)", exercises: ["Burpees", "Mountain Climbers", "Jumping Jacks"], motivation: "HIIT it hard!" },
      { day: "Day 6", workout: "Core + Cardio (High)", exercises: ["Sit-ups", "Russian Twists", "Jog 20 mins"], motivation: "Core strength matters!" },
      { day: "Day 7", workout: "Active Recovery", exercises: ["Yoga", "Stretching", "Walk 30 mins"], motivation: "Recovery is growth!" },
    ];

    res.render("aiDashboard", { weeklyPlan: fallbackPlan, user: req.user });
  }
});

// ================== SAVE PROGRESS ================== //
router.post("/save-progress", isAuthenticated, (req, res) => {
  console.log("Completed Days:", req.body.completedDays);
  res.redirect("/dashboard");
});

module.exports = router;






// const express = require("express");
// const router = express.Router();
// const jwt = require("jsonwebtoken");
// const { OpenAI } = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });


// // AUTH MIDDLEWARE
// function isAuthenticated(req, res, next) {
//   const token = req.cookies.token;
//   if (!token) return res.redirect("/login");

//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();
//   } catch (err) {
//     return res.redirect("/login");
//   }
// }

// // ================= AI WEEKLY PLAN =================
// router.get("/ai-plan", isAuthenticated, async (req, res) => {
//   const { ageGroup, sex, height, weight, goal } = req.user;

//   try {
//     const prompt = `
//       Create a 7-day personalized workout plan for a ${ageGroup} ${sex} 
//       with height ${height} cm, weight ${weight} kg, and goal "${goal}". 
//       Include daily exercises and motivational tips.
//       Respond in JSON like this format:
//       [
//         { "day": "Day 1", "workout": "Workout Name", "exercises": ["Exercise1","Exercise2"], "motivation": "Motivation text" },
//         ...
//       ]
//     `;

//     const aiResponse = await openai.createChatCompletion({
//       model: "gpt-4",
//       messages: [{ role: "user", content: prompt }],
//       temperature: 0.7
//     });

//     const content = aiResponse.data.choices[0].message.content;

//     // Parse AI response safely
//     let weeklyPlan;
//     try {
//       weeklyPlan = JSON.parse(content);
//     } catch (err) {
//       weeklyPlan = JSON.parse(JSON.stringify([
//         { day: "Day 1", workout: "Basic full-body workout", exercises: ["Walking 20 mins","Bodyweight exercises","Chest and Triceps"], motivation: "Every step counts 🚀", completed: false },
//         { day: "Day 2", workout: "Cardio full-body workout", exercises: ["Walking 20 mins","Bodyweight exercises","Back and Biceps"], motivation: "🌟 Consistency is better than perfection!", completed: false },
//         { day: "Day 3", workout: "Strength full-body workout", exercises: ["Walking 20 mins","Bodyweight exercises","Legs"], motivation: "💪 Keep pushing your limits!", completed: false },
//         { day: "Day 4", workout: "Balance full-body workout", exercises: ["Walking 20 mins","Bodyweight exercises","Shoulders and Abs"], motivation: "🧘‍♀️ Focus on your form and balance!", completed: false },
//         { day: "Day 5", workout: "HIIT full-body workout", exercises: ["Walking 20 mins","Bodyweight exercises","Full Body HIIT"], motivation: "🔥 Push your limits and embrace the challenge!", completed: false },
//         { day: "Day 6", workout: "Core + Cardio full-body workout", exercises: ["Walking 20 mins","Bodyweight exercises","Core + Cardio"], motivation: "🔥 Keep up the momentum!", completed: false },
//         { day: "Day 7", workout: "Active Recovery full-body workout", exercises: ["Walking 20 mins","Bodyweight exercises","Active Recovery"], motivation: "🧘‍♀️ Rest and recharge!", completed: false }
//       ]));
//     }

//     // Render dashboard with AI plan
//     res.render("dashboard", { user: req.user, weeklyPlan });

//   } catch (err) {
//     console.log("AI Error:", err.message);

//     // Fallback if AI fails
//     const fallbackPlan = [];
//     for (let i = 1; i <= 7; i++) {
//       fallbackPlan.push({
//         day: `Day ${i}`,
//         workout: "Basic full-body workout",
//         exercises: ["Walking 20 mins","Bodyweight exercises","Stretching"],
//         motivation: "Every step counts 🚀",
//         completed: false
//       });
//     }
//     res.render("dashboard", { user: req.user, weeklyPlan: fallbackPlan });
//   }
// });

// // ================= SAVE PROGRESS =================
// router.post("/save-progress", isAuthenticated, (req, res) => {
//   console.log("Completed Days:", req.body.completedDays || []);
//   res.redirect("/dashboard");
// });

// module.exports = router;