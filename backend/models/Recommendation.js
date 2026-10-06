const mongoose = require("mongoose");

const recommendationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
      trim: true,
    },

    impactScore: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: ["transportation", "energy", "food", "waste", "water"],
      required: true,
    },

    relatedGoalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Goal",
      default: null,
    },

    status: {
      type: String,
      enum: ["suggested", "accepted", "dismissed"],
      default: "suggested",
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

recommendationSchema.index({
  userId: 1,
  status: 1,
  createdAt: -1,
});

module.exports = mongoose.model("Recommendation", recommendationSchema);
