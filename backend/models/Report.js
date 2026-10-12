
const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    fromDate: {
      type: Date,
      required: true,
    },
    toDate: {
      type: Date,
      required: true,
    },
    format: {
      type: String,
      enum: ["CSV", "Excel", "PDF"],
      required: true,
    },
    sections: {
      type: [String],
      required: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileData: {
      type: Buffer,
      required: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", reportSchema);
