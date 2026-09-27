const mongoose = require("mongoose");

const gamificationProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true
  },

  rewardPoints: {
    type: Number,
    default: 0,
    min: 0
  },

  ecoScore: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },

  level: {
    type: Number,
    default: 1,
    min: 1
  },

  earnedBadges: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Badge"
  }],

  categoryCapStreaks: {
    transportation: {
      type: Number,
      default: 0
    },
    energy: {
      type: Number,
      default: 0
    },
    food: {
      type: Number,
      default: 0
    },
    waste: {
      type: Number,
      default: 0
    },
    water: {
      type: Number,
      default: 0
    }
  }

}, {
  timestamps: true
});

gamificationProfileSchema.index({ rewardPoints: -1 });
gamificationProfileSchema.index({ ecoScore: -1 });

module.exports = mongoose.model(
  "GamificationProfile",
  gamificationProfileSchema
);