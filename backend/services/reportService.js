const CarbonEntry = require("../models/CarbonEntry");
const Goal = require("../models/Goal");
const GoalProgress = require("../models/GoalProgress");
const UserChallenge = require("../models/UserChallenge");

async function getReportData(startDate, endDate, userId = null) {
  const start = new Date(startDate);
  const end = new Date(endDate);

  const carbonMatch = {
    isDeleted: false,
    date: {
      $gte: start,
      $lte: end,
    },
  };

  if (userId) {
    carbonMatch.userId = userId;
  }

  const emissionsByCategory = await CarbonEntry.aggregate([
    {
      $match: carbonMatch,
    },
    {
      $group: {
        _id: "$category",
        totalEmissions: {
          $sum: "$calculatedCO2",
        },
      },
    },
    {
      $project: {
        _id: 0,
        category: "$_id",
        totalEmissions: 1,
      },
    },
    {
      $sort: {
        category: 1,
      },
    },
  ]);

  const goalMatch = {
    createdAt: {
      $lte: end,
    },
  };

  if (userId) {
    goalMatch.userId = userId;
  }

  const goalResults = await Goal.aggregate([
    {
      $match: goalMatch,
    },
    {
      $group: {
        _id: "$status",
        count: {
          $sum: 1,
        },
        target: {
          $sum: "$target",
        },
        currentValue: {
          $sum: "$currentValue",
        },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: 1,
        target: 1,
        currentValue: 1,
      },
    },
  ]);

  const progressMatch = {
    date: {
      $gte: start,
      $lte: end,
    },
  };

  if (userId) {
    progressMatch.userId = userId;
  }

  const goalProgress = await GoalProgress.aggregate([
    {
      $match: progressMatch,
    },
    {
      $group: {
        _id: "$goalId",
        totalProgress: {
          $sum: "$progress",
        },
        averageProgress: {
          $avg: "$progress",
        },
        entries: {
          $sum: 1,
        },
      },
    },
    {
      $project: {
        _id: 0,
        goalId: "$_id",
        totalProgress: 1,
        averageProgress: 1,
        entries: 1,
      },
    },
  ]);

  const challengeMatch = {
    joinedAt: {
      $gte: start,
      $lte: end,
    },
  };

  if (userId) {
    challengeMatch.userId = userId;
  }

  const challengeParticipation = await UserChallenge.aggregate([
    {
      $match: challengeMatch,
    },
    {
      $group: {
        _id: "$status",
        members: {
          $sum: 1,
        },
        averageProgress: {
          $avg: "$currentProgress",
        },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        members: 1,
        averageProgress: {
          $round: [
            "$averageProgress",
            2,
          ],
        },
      },
    },
  ]);

  const perUserBreakdown = await CarbonEntry.aggregate([
    {
      $match: carbonMatch,
    },
    {
      $group: {
        _id: "$userId",
        totalEmissions: {
          $sum: "$calculatedCO2",
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        name: "$user.name",
        email: "$user.email",
        totalEmissions: 1,
      },
    },
    {
      $sort: {
        totalEmissions: -1,
      },
    },
  ]);

  return {
    dateRange: {
      from: start,
      to: end,
    },
    emissionsByCategory,
    goalResults,
    goalProgress,
    challengeParticipation,
    perUserBreakdown,
  };
}

module.exports = {
  getReportData,
};