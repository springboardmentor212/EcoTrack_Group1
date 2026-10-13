const User = require("../models/User");
const Profile = require("../models/Profile");
const CarbonEntry = require("../models/CarbonEntry");
const Goal = require("../models/Goal");
const GamificationProfile = require("../models/GamificationProfile");

const startOfMonth = () => {
  const d = new Date();
  return new Date(d.getFullYear(), d.getMonth(), 1);
};
const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function getUserStats() {
  const monthStart = startOfMonth();
  const loggedIds = await CarbonEntry.distinct("userId", {
    isDeleted: false,
    date: { $gte: monthStart },
  });

  const [
    totalUsers,
    administrators,
    suspended,
    newUsers,
    newSuspended,
    newAdmins,
    activeThisMonth,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "admin" }),
    User.countDocuments({ status: "suspended" }),
    User.countDocuments({ createdAt: { $gte: monthStart } }),
    User.countDocuments({
      status: "suspended",
      suspendedAt: { $gte: monthStart },
    }),
    User.countDocuments({ role: "admin", roleChangedAt: { $gte: monthStart } }),
    User.countDocuments({
      status: { $ne: "suspended" },
      $or: [
        { _id: { $in: loggedIds } },
        { lastActiveAt: { $gte: monthStart } },
      ],
    }),
  ]);

  return {
    totalUsers: { value: totalUsers, changeThisMonth: newUsers },
    activeThisMonth: {
      value: activeThisMonth,
      percentOfUsers: totalUsers
        ? Math.round((activeThisMonth / totalUsers) * 100)
        : 0,
    },
    administrators: { value: administrators, changeThisMonth: newAdmins },
    suspended: { value: suspended, changeThisMonth: newSuspended },
  };
}

async function listUsers({ search, role, status, page = 1, limit = 10 }) {
  const match = {};
  if (role) match.role = role;
  if (status === "suspended") match.status = "suspended";
  else if (status === "active") match.status = { $ne: "suspended" };
  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), "i");
    match.$or = [{ name: rx }, { email: rx }];
  }

  const [result] = await User.aggregate([
    { $match: match },
    { $sort: { createdAt: -1 } },
    {
      $facet: {
        data: [
          { $skip: (page - 1) * limit },
          { $limit: limit },
          {
            $lookup: {
              from: GamificationProfile.collection.name,
              localField: "_id",
              foreignField: "userId",
              as: "gp",
            },
          },
          {
            $project: {
              name: 1,
              email: 1,
              role: 1,
              createdAt: 1,
              lastActiveAt: 1,
              status: { $ifNull: ["$status", "active"] },
              ecoScore: { $ifNull: [{ $arrayElemAt: ["$gp.ecoScore", 0] }, 0] },
            },
          },
        ],
        total: [{ $count: "count" }],
      },
    },
  ]);

  return {
    users: result.data,
    total: result.total[0] ? result.total[0].count : 0,
  };
}

async function getUserDetail(id) {
  const user = await User.findById(id)
    .select("name email role status createdAt lastActiveAt suspendedAt")
    .lean();
  if (!user) return null;

  const [profile, gp, entriesCount, goals] = await Promise.all([
    Profile.findOne({ user: id }).select("phone location bio").lean(),
    GamificationProfile.findOne({ userId: id })
      .select("ecoScore rewardPoints level")
      .lean(),
    CarbonEntry.countDocuments({ userId: id, isDeleted: false }),
    Goal.find({ userId: id }).select("status").lean(),
  ]);

  const goalsSummary = {
    total: goals.length,
    active: 0,
    completed: 0,
    paused: 0,
  };
  goals.forEach((g) => {
    if (goalsSummary[g.status] !== undefined) goalsSummary[g.status] += 1;
  });

  return {
    ...user,
    status: user.status || "active",
    profile: profile || {},
    ecoScore: gp ? gp.ecoScore : 0,
    rewardPoints: gp ? gp.rewardPoints : 0,
    level: gp ? gp.level : "Eco Beginner",
    entriesCount,
    goalsSummary,
  };
}

module.exports = { getUserStats, listUsers, getUserDetail };
