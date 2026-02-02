const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  completedDays: [Number]
}, { timestamps: true });

module.exports = mongoose.model("Progress", progressSchema);