const mongoose = require("mongoose");

const rankSnapshotSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    rank: { type: Number, required: true },
    ecoScore: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("RankSnapshot", rankSnapshotSchema);