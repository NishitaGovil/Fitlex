const Profile = require("../models/Profile");
const WorkoutPlan = require("../models/WorkoutPlan");
const generateWorkoutPlanWithAI = require("../services/openaiService");

exports.generateWorkoutPlan = async (req, res) => {
  const profile = await Profile.findOne({ userId: req.user.id });

  if (!profile) {
    return res.status(400).json({ message: "Profile not found" });
  }

  const aiResult = await generateWorkoutPlanWithAI(profile);

  const savedPlan = await WorkoutPlan.create({
    userId: req.user.id,
    plan: aiResult.plan
  });

  res.json(savedPlan);
};