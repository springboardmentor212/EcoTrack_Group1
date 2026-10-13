const User = require("../models/User");
const CarbonEntry = require("../models/CarbonEntry");
const Goal = require("../models/Goal");
const Challenge = require("../models/Challenge");
const { computeStatus } = require("./challengeStatus");
const { getChallengeMemberStats } = require("./challengeAggregations");

const CATEGORIES = ["transportation", "energy", "food", "waste", "water"];
const round = (n, d = 2) => Math.round((Number(n) || 0) * 10 ** d) / 10 ** d;

async function emissionsByCategory(from, to) {
  const rows = await CarbonEntry.aggregate([
    { $match: { isDeleted: false, date: { $gte: from, $lte: to } } },
    {
      $group: {
        _id: { $toLower: "$category" },
        entries: { $sum: 1 },
        totalKg: { $sum: "$calculatedCO2" },
      },
    },
  ]);
  const byCat = new Map(rows.map((r) => [r._id, r]));
  const grand = rows.reduce((s, r) => s + r.totalKg, 0);
  return CATEGORIES.map((c) => {
    const r = byCat.get(c) || { entries: 0, totalKg: 0 };
    return {
      category: c,
      entries: r.entries,
      totalKg: round(r.totalKg),
      share: grand ? round((r.totalKg / grand) * 100, 1) : 0,
    };
  });
}

async function goalResults(from, to) {
  const rows = await Goal.aggregate([
    { $match: { createdAt: { $lte: to }, deadline: { $gte: from } } },
    {
      $group: {
        _id: { $toLower: "$category" },
        goals: { $sum: 1 },
        completed: {
          $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] },
        },
        withinCap: {
          $sum: { $cond: [{ $lte: ["$currentValue", "$target"] }, 1, 0] },
        },
      },
    },
  ]);
  const byCat = new Map(rows.map((r) => [r._id, r]));
  return CATEGORIES.map((c) => {
    const r = byCat.get(c) || { goals: 0, completed: 0, withinCap: 0 };
    return {
      category: c,
      goals: r.goals,
      completed: r.completed,
      withinCap: r.withinCap,
      exceeded: r.goals - r.withinCap,
      successRate: r.goals ? round((r.withinCap / r.goals) * 100, 1) : 0,
    };
  });
}

async function challengeParticipation(from, to) {
  const challenges = await Challenge.find({
    startDate: { $lte: to },
    endDate: { $gte: from },
  })
    .sort({ startDate: 1 })
    .lean();
  const stats = await getChallengeMemberStats(challenges.map((c) => c._id));
  return challenges.map((c) => {
    const s = stats.get(String(c._id)) || { membersJoined: 0, avgProgress: 0 };
    return {
      title: c.title,
      category: c.category,
      status: computeStatus(c),
      members: s.membersJoined,
      avgProgress: s.avgProgress,
      points: c.rewardPoints || 0,
    };
  });
}

async function perUserBreakdown(from, to) {
  const catSums = {};
  CATEGORIES.forEach((c) => {
    catSums[c] = {
      $sum: { $cond: [{ $eq: ["$cat", c] }, "$calculatedCO2", 0] },
    };
  });
  const rows = await CarbonEntry.aggregate([
    { $match: { isDeleted: false, date: { $gte: from, $lte: to } } },
    { $addFields: { cat: { $toLower: "$category" } } },
    {
      $group: {
        _id: "$userId",
        entries: { $sum: 1 },
        totalKg: { $sum: "$calculatedCO2" },
        ...catSums,
      },
    },
    { $sort: { totalKg: -1 } },
    {
      $lookup: {
        from: User.collection.name,
        localField: "_id",
        foreignField: "_id",
        as: "u",
      },
    },
    { $unwind: { path: "$u", preserveNullAndEmptyArrays: true } },
  ]);
  return rows.map((r) => ({
    name: r.u ? r.u.name : "Deleted user",
    email: r.u ? r.u.email : "-",
    entries: r.entries,
    totalKg: round(r.totalKg),
    ...Object.fromEntries(CATEGORIES.map((c) => [c, round(r[c])])),
  }));
}

module.exports = {
  CATEGORIES,
  emissionsByCategory,
  goalResults,
  challengeParticipation,
  perUserBreakdown,
};
