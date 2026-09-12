const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  target: {
    type: Number,
    required: true,
    min: 0
  },
  timeframe: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ["active", "completed", "paused"],
    default: "active"
  }
}, {
  timestamps: true
});

module.exports = mongoose.model("Goal", goalSchema);