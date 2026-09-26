const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    enum: [
      "Transportation",
      "Energy",
      "Food",
      "Waste",
      "Water"
    ],
    required: true
  },

  target: {
    type: Number,
    required: true,
    min: 0
  },

  unit: {
    type: String,
    required: true,
    trim: true
  },

  startDate: {
    type: Date,
    required: true
  },

  endDate: {
    type: Date,
    required: true
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  status: {
    type: String,
    enum: ["upcoming", "active", "completed"],
    default: "upcoming"
  },

  rewardPoints: {
    type: Number,
    default: 0,
    min: 0
  },

  isDeleted: {
    type: Boolean,
    default: false
  }

}, {
  timestamps: true
});

challengeSchema.index({ category: 1, status: 1 });

challengeSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model(
  "Challenge",
  challengeSchema
);