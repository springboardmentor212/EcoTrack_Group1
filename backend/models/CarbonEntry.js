const mongoose = require("mongoose");

const carbonEntrySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  value: {
    type: Number,
    required: true,
    min: 0
  },
  unit: {
    type: String,
    required: true,
    trim: true
  },
  calculatedCO2: {
    type: Number,
    required: true,
    min: 0
  },
  date: {
    type: Date,
    default: Date.now,
    required: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

carbonEntrySchema.index({ userId: 1, date: -1 });
carbonEntrySchema.index({ category: 1 });

module.exports = mongoose.model("CarbonEntry", carbonEntrySchema);