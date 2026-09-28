const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  type: {
    type: String,
    enum: [
      "goal",
      "challenge",
      "ai",
      "system"
    ],
    required: true
  },

  title: {
    type: String,
    required: true,
    trim: true
  },

  message: {
    type: String,
    required: true,
    trim: true
  },

  isRead: {
    type: Boolean,
    default: false
  },

  readAt: {
    type: Date,
    default: null
  }

}, {
  timestamps: {
    createdAt: false,
    updatedAt: true
  }
});

notificationSchema.index({
  userId: 1,
  isRead: 1
});

notificationSchema.index({
  userId: 1,
  createdAt: -1
});

module.exports = mongoose.model(
  "Notification",
  notificationSchema
);