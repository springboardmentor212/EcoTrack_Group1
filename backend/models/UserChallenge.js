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

  progress: {
    type: Number,
    default: 0,
    min: 0
  },

  status: {
    type: String,
    enum: ["joined", "in-progress", "completed"],
    default: "joined"
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

userChallengeSchema.index(
  { userId: 1, challengeId: 1 },
  { unique: true }
);

userChallengeSchema.index({
  challengeId: 1,
  status: 1
});

module.exports = mongoose.model(
  "UserChallenge",
  userChallengeSchema
);