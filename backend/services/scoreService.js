const mongoose = require("mongoose");
const User = require("../models/User");
const Goal = require("../models/Goal");
const CarbonEntry = require("../models/CarbonEntry");
const { getAllCategoryEmissionsInRange } = require("../utils/aggregations");
const { levelForScore } = require("./gamificationService");

const DAY_MS = 24 * 60 * 60 * 1000;

const getPeriodStart = (timeframe) => {
  const now = new Date();
  if (timeframe === "Daily") {
    return new Date(now.getFullYear(), now.getMonth(), now.getDate());
  }
  if (timeframe === "Weekly") {
    const day = now.getDay();
    const diffToMonday = (day === 0 ? -6 : 1) - day;
    const monday = new Date(now);
    monday.setDate(now.getDate() + diffToMonday);
    monday.setHours(0, 0, 0, 0);
    return monday;
  }
  return new Date(now.getFullYear(), now.getMonth(), 1);
};

async function getGoalUsage(userId) {
  const now = new Date();
  const goals = await Goal.find({
    userId,
    status: { $nin: ["completed", "paused"] },
  });

  return Promise.all(
    goals.map(async (g) => {
      const totals = await getAllCategoryEmissionsInRange(
        userId,
        getPeriodStart(g.timeframe),
        now,
      );
      return {
        used: totals[g.category.toLowerCase()] || 0,
        target: g.target,
      };
    }),
  );
}

async function calculateUserScore(userId, goalUsage) {
  const now = new Date();
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);
  const from = new Date(now.getTime() - 30 * DAY_MS);

  const [stats] = await CarbonEntry.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        isDeleted: { $ne: true },
        date: { $gte: from, $lte: endOfToday },
      },
    },
    {
      $group: {
        _id: null,
        totalKg: { $sum: "$calculatedCO2" },
        count: { $sum: 1 },
      },
    },
  ]);

  if (!stats) return null;

  const footprintScore = Math.max(
    0,
    Math.min(50, 50 - Math.round(stats.totalKg / 2)),
  );

  const usage = goalUsage || (await getGoalUsage(userId));
  const percents = usage.map((g) =>
    g.target > 0 ? Math.min(100, Math.round((g.used / g.target) * 100)) : 0,
  );
  const avg = percents.length
    ? percents.reduce((s, p) => s + p, 0) / percents.length
    : 0;
  const goalScore = Math.round((avg / 100) * 30);

  const activityScore = Math.min(20, stats.count * 4);

  return Math.min(100, footprintScore + goalScore + activityScore);
}

async function getScoreboard() {
  const users = await User.find().select("name");

  const rows = await Promise.all(
    users.map(async (u) => {
      const ecoScore = await calculateUserScore(u._id);
      if (ecoScore === null) return null;
      return {
        userId: u._id,
        name: u.name,
        ecoScore,
        level: levelForScore(ecoScore),
      };
    }),
  );

  return rows
    .filter(Boolean)
    .sort((a, b) => b.ecoScore - a.ecoScore || a.name.localeCompare(b.name))
    .map((r, i) => ({ ...r, rank: i + 1 }));
}
async function getUserBadgeStats(userId) {
  const rows = await CarbonEntry.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        isDeleted: { $ne: true },
      },
    },
    {
      $group: {
        _id: { $toLower: "$category" },
        count: { $sum: 1 },
        days: {
          $addToSet: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
        },
      },
    },
  ]);

  const categoryEntries = {};
  const days = new Set();
  let entryCount = 0;
  rows.forEach((r) => {
    categoryEntries[r._id] = r.count;
    entryCount += r.count;
    r.days.forEach((d) => days.add(d));
  });

  const goalUsage = await getGoalUsage(userId);
  const ecoScore = await calculateUserScore(userId, goalUsage);

  return {
    entryCount,
    categoryEntries,
    activeDays: days.size,
    ecoScore,
    underCapGoals: goalUsage.filter(
      (g) => g.target > 0 && g.used > 0 && g.used <= g.target,
    ).length,
  };
}

module.exports = { calculateUserScore, getScoreboard, getUserBadgeStats };
