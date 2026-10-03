const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },

  description: {
    type: String,
    trim: true
  },

  iconUrl: {
    type: String,
    required: true,
    trim: true
  },

  category: {
    type: String,
    enum: [
      "transportation",
      "energy",
      "food",
      "waste",
      "water",
      "general"
    ],
    default: "general"
  },

  criteriaKey: {
    type: String,
    required: true,
    trim: true
  }

}, {
  timestamps: true
});

module.exports = mongoose.model(
  "Badge",
  badgeSchema
);