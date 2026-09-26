const mongoose = require("mongoose");

const userChallengeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  challengeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Challenge",
    required: true
  },

  status: {
    type: String,
    enum: ["joined", "in_progress", "completed", "failed"],
    default: "joined"
  },

  currentProgress: {
    type: Number,
    default: 0,
    min: 0
  },

  joinedAt: {
    type: Date,
    default: Date.now
  },

  completedAt: {
    type: Date,
    default: null
  }

}, {
  timestamps: true
});

// Prevent duplicate challenge joining
userChallengeSchema.index(
  { userId: 1, challengeId: 1 },
  { unique: true }
);

// Find challenges by user and status
userChallengeSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model(
  "UserChallenge",
  userChallengeSchema
);