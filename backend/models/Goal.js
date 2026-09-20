const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  isCompleted: {
    type: Boolean,
    default: false
  }
}, {
  _id: true
});

const goalSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: true
  },

  description: {
    type: String,
    default: ""
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

  deadline: {
    type: Date,
    required: true
  },

  unit: {
    type: String,
    required: true
  },

  currentValue: {
    type: Number,
    default: 0,
    min: 0
  },

  milestones: [milestoneSchema],

  status: {
    type: String,
    enum: ["active", "completed", "paused"],
    default: "active"
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Goal", goalSchema);