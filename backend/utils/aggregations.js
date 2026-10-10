const mongoose = require("mongoose");
const CarbonEntry = require("../models/CarbonEntry");
const User = require("../models/User");
const UserChallenge = require("../models/UserChallenge");

async function getCategoryEmissionsInRange(
  userId,
  category,
  startDate,
  endDate
) {
  const result = await CarbonEntry.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        category,
        isDeleted: false,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: null,
        total: {
          $sum: "$calculatedCO2",
        },
      },
    },
  ]);

  return result.length > 0 ? result[0].total : 0;
}

async function getAllCategoryEmissionsInRange(
  userId,
  startDate,
  endDate
) {
  const rows = await CarbonEntry.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        isDeleted: false,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: "$category",
        total: {
          $sum: "$calculatedCO2",
        },
      },
    },
  ]);

  const CATEGORIES = [
    "transportation",
    "energy",
    "food",
    "waste",
    "water",
  ];

  const totals = Object.fromEntries(
    CATEGORIES.map((category) => [category, 0])
  );

  rows.forEach((row) => {
    totals[row._id] = row.total;
  });

  return totals;
}

async function getCategoryEmissionsForUsers(
  userIds,
  category,
  startDate,
  endDate
) {
  const objectIds = userIds.map(
    (id) => new mongoose.Types.ObjectId(id)
  );

  const rows = await CarbonEntry.aggregate([
    {
      $match: {
        userId: {
          $in: objectIds,
        },
        category,
        isDeleted: false,
        date: {
          $gte: new Date(startDate),
          $lte: new Date(endDate),
        },
      },
    },
    {
      $group: {
        _id: "$userId",
        total: {
          $sum: "$calculatedCO2",
        },
      },
    },
  ]);

  const map = new Map(
    userIds.map((id) => [id.toString(), 0])
  );

  rows.forEach((row) => {
    map.set(row._id.toString(), row.total);
  });

  return map;
}

async function getUserStats() {
  const now = new Date();

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  );

  const startOfNextMonth = new Date(
    now.getFullYear(),
    now.getMonth() + 1,
    1
  );

  const startOfPreviousMonth = new Date(
    now.getFullYear(),
    now.getMonth() - 1,
    1
  );

  const result = await User.aggregate([
    {
      $group: {
        _id: null,

        totalUsers: {
          $sum: 1,
        },

        administrators: {
          $sum: {
            $cond: [
              {
                $eq: ["$role", "admin"],
              },
              1,
              0,
            ],
          },
        },

        suspendedUsers: {
          $sum: {
            $cond: [
              {
                $eq: ["$status", "suspended"],
              },
              1,
              0,
            ],
          },
        },

        activeThisMonth: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ["$status", "active"],
                  },
                  {
                    $gte: [
                      "$lastActiveAt",
                      startOfMonth,
                    ],
                  },
                  {
                    $lt: [
                      "$lastActiveAt",
                      startOfNextMonth,
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },

        newUsersThisMonth: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $gte: [
                      "$createdAt",
                      startOfMonth,
                    ],
                  },
                  {
                    $lt: [
                      "$createdAt",
                      startOfNextMonth,
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },

        suspendedThisMonth: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ["$status", "suspended"],
                  },
                  {
                    $gte: [
                      "$suspendedAt",
                      startOfMonth,
                    ],
                  },
                  {
                    $lt: [
                      "$suspendedAt",
                      startOfNextMonth,
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },

        newAdministratorsThisMonth: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $eq: ["$role", "admin"],
                  },
                  {
                    $gte: [
                      "$createdAt",
                      startOfMonth,
                    ],
                  },
                  {
                    $lt: [
                      "$createdAt",
                      startOfNextMonth,
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },

        previousMonthUsers: {
          $sum: {
            $cond: [
              {
                $and: [
                  {
                    $gte: [
                      "$createdAt",
                      startOfPreviousMonth,
                    ],
                  },
                  {
                    $lt: [
                      "$createdAt",
                      startOfMonth,
                    ],
                  },
                ],
              },
              1,
              0,
            ],
          },
        },
      },
    },
  ]);

  return (
    result[0] || {
      totalUsers: 0,
      administrators: 0,
      suspendedUsers: 0,
      activeThisMonth: 0,
      newUsersThisMonth: 0,
      suspendedThisMonth: 0,
      newAdministratorsThisMonth: 0,
      previousMonthUsers: 0,
    }
  );
}

async function getUserListWithEcoScore(
  search = "",
  role = "",
  status = "",
  page = 1,
  limit = 10
) {
  const currentPage = Number(page);
  const currentLimit = Number(limit);
  const skip = (currentPage - 1) * currentLimit;

  const match = {};

  if (role) {
    match.role = role;
  }

  if (status) {
    match.status = status;
  }

  if (search) {
    match.$or = [
      {
        name: {
          $regex: search,
          $options: "i",
        },
      },
      {
        email: {
          $regex: search,
          $options: "i",
        },
      },
    ];
  }

  const result = await User.aggregate([
    {
      $match: match,
    },
    {
      $lookup: {
        from: "gamificationprofiles",
        localField: "_id",
        foreignField: "userId",
        as: "gamificationProfile",
      },
    },
    {
      $unwind: {
        path: "$gamificationProfile",
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        role: 1,
        status: 1,
        createdAt: 1,
        lastActiveAt: 1,
        ecoScore: {
          $ifNull: [
            "$gamificationProfile.ecoScore",
            0,
          ],
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $facet: {
        users: [
          {
            $skip: skip,
          },
          {
            $limit: currentLimit,
          },
        ],
        totalCount: [
          {
            $count: "total",
          },
        ],
      },
    },
  ]);

  const users = result[0]?.users || [];
  const total = result[0]?.totalCount[0]?.total || 0;

  return {
    users,
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages: Math.ceil(
      total / currentLimit
    ),
  };
}

async function getChallengeMembersAndProgress() {
  const result = await UserChallenge.aggregate([
    {
      $group: {
        _id: "$challengeId",
        membersJoined: {
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
        challengeId: "$_id",
        membersJoined: 1,
        averageProgress: {
          $round: [
            "$averageProgress",
            2,
          ],
        },
      },
    },
  ]);

  return result;
}

module.exports = {
  getCategoryEmissionsInRange,
  getAllCategoryEmissionsInRange,
  getCategoryEmissionsForUsers,
  getUserStats,
  getUserListWithEcoScore,
  getChallengeMembersAndProgress,
};