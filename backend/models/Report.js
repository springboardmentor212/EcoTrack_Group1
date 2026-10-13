
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    scope: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },

    periodFrom: {
      type: Date,
    },

    periodTo: {
      type: Date,
    },

    format: {
      type: String,
      enum: ["pdf", "excel"],
      default: "pdf",
    },

    includes: {
      type: [
        {
          type: String,
          enum: [
            "emissionsByCategory",
            "goalResults",
            "goalProgress",
            "challengeParticipation",
            "perUserBreakdown",
          ],
        },
      ],
      default: [],
    },

    fileName: {
      type: String,
    },

    filePath: {
      type: String,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

// Admin list indexes
reportSchema.index({ createdAt: -1 });
reportSchema.index({ scope: 1, createdAt: -1 });

module.exports = mongoose.model("Report", reportSchema);
