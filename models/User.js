const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
 name: String,
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  
  
  // New Profile Fields
  fullName: String,
  dob: String,
  ageGroup: String,
  sex: String,
  height: Number,
  weight: Number,
  fitnessGoal: String
}, { timestamps: true });
module.exports = mongoose.model("user", userSchema);
