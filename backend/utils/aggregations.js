const mongoose = require("mongoose");
const CarbonEntry = require("../models/CarbonEntry");

/**
 * @returns {Promise<number>}
 */
async function getCategoryEmissionsInRange(
  userId,
  category,
  startDate,
  endDate,
) {
  const result = await CarbonEntry.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        category,
        isDeleted: false,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      },
    },
    {
      $group: {
        _id: null,
        total: { $sum: "$calculatedCO2" },
      },
    },
  ]);

  return result.length > 0 ? result[0].total : 0;
}

/**
 * @returns {Promise<Object>}
 */
async function getAllCategoryEmissionsInRange(userId, startDate, endDate) {
  const rows = await CarbonEntry.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      },
    },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$calculatedCO2" },
      },
    },
  ]);

  const CATEGORIES = ["transportation", "energy", "food", "waste", "water"];
  const totals = Object.fromEntries(CATEGORIES.map((c) => [c, 0]));
  rows.forEach((row) => {
    const key = String(row._id).toLowerCase();
    totals[key] = (totals[key] || 0) + row.total;
  });
  return totals;
}

/**
 * @param {string[]} userIds
 * @returns {Promise<Map<string, number>>}
 */
async function getCategoryEmissionsForUsers(
  userIds,
  category,
  startDate,
  endDate,
) {
  const objectIds = userIds.map((id) => new mongoose.Types.ObjectId(id));

  const rows = await CarbonEntry.aggregate([
    {
      $match: {
        userId: { $in: objectIds },
        category,
        isDeleted: false,
        date: { $gte: new Date(startDate), $lte: new Date(endDate) },
      },
    },
    {
      $group: {
        _id: "$userId",
        total: { $sum: "$calculatedCO2" },
      },
    },
  ]);

  const map = new Map(userIds.map((id) => [id.toString(), 0]));
  rows.forEach((row) => {
    map.set(row._id.toString(), row.total);
  });
  return map;
}

module.exports = {
  getCategoryEmissionsInRange,
  getAllCategoryEmissionsInRange,
  getCategoryEmissionsForUsers,
};
