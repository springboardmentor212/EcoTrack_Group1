const mongoose = require("mongoose");

const challengeSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Challenge title is required"],
      maxlength: 100,
      trim: true,
    },

    description: {
      type: String,
      required: [true, "Challenge description is required"],
      trim: true,
    },

    category: {
      type: String,
      enum: ["transportation", "energy", "food", "waste", "water"],
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return !this.startDate || value > this.startDate;
        },
        message: "End date must be after start date",
      },
    },

    endedAt: {
      type: Date,
      default: null,
    },

    targetMetric: {
      type: Number,
      required: [
        true,
        "Target metric (category emission cap in kg CO2e) is required",
      ],
      min: 0,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    status: {
      type: String,
      enum: ["upcoming", "active", "ended"],
      default: "upcoming",
    },
  },
  {
    timestamps: true,
  }
);

// Admin list indexes
challengeSchema.index({ category: 1, status: 1 });
challengeSchema.index({ startDate: 1, endDate: 1 });

module.exports = mongoose.model("Challenge", challengeSchema);