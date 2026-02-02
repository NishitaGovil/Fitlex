const mongoose = require("mongoose");

const workoutPlanSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },

  plan: [
    {
      day: String,           // Day 1, Day 2...
      workout: [String],     // exercises
      completed: {
        type: Boolean,
        default: false
      }
    }
  ],

  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("WorkoutPlan", workoutPlanSchema);