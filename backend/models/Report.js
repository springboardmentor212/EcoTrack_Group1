const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    scope: {
      type: String,
      enum: ["user", "admin"],
      required: true,
    },

    periodFrom: {
      type: Date,
      required: true,
    },

    periodTo: {
      type: Date,
      required: true,
    },

    format: {
      type: String,
      enum: ["pdf", "excel"],
      required: true,
    },

    includes: {
      type: [String],
      default: [],
    },

    fileName: {
      type: String,
      required: true,
    },

    filePath: {
      type: String,
      required: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Admin list index
reportSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Report", reportSchema);