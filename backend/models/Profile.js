const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  profilePicture: {
    type: String,
    default: ""
  },

  location: {
    type: String,
    default: ""
  },

  sustainabilityPreferences: {
    type: [String],
    default: []
  },

  environmentalInterests: {
    type: [String],
    default: []
  },

  personalGoalPreferences: {
    type: [String],
    default: []
  },

  lifestyleConfiguration: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("Profile", profileSchema);