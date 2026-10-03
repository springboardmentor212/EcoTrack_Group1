// const GamificationProfile = require('../models/GamificationProfile');
// const Badge = require('../models/Badge');
const { getOrCreateProfile } = require("../services/gamificationService");

async function getLeaderboard(req, res) {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
    const skip = (page - 1) * limit;

    const [profiles, total] = await Promise.all([
      GamificationProfile.find()
        .sort({ ecoScore: -1 })
        .skip(skip)
        .limit(limit)
        .populate("userId", "name username"),
      GamificationProfile.countDocuments(),
    ]);

    const rankedFrom = skip + 1;
    const data = profiles.map((p, i) => ({
      rank: rankedFrom + i,
      userId: p.userId._id,
      name: p.userId.name,
      ecoScore: p.ecoScore,
      level: p.level,
    }));

    return res.status(200).json({
      success: true,
      data,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error("getLeaderboard error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load leaderboard" });
  }
}

async function getMyProfile(req, res) {
  try {
    const userId = req.user.id;
    const profile = await getOrCreateProfile(userId);
    await profile.populate("earnedBadges.badge");
    const thresholds = [40, 70, 90, 100];
    const nextThreshold = thresholds.find((t) => t > profile.ecoScore);
    const pointsToNextLevel = nextThreshold
      ? nextThreshold - profile.ecoScore
      : 0;

    return res.status(200).json({
      success: true,
      data: {
        ecoScore: profile.ecoScore,
        rewardPoints: profile.rewardPoints,
        level: profile.level,
        pointsToNextLevel,
        categoryCapStreaks: profile.categoryCapStreaks,
        earnedBadges: profile.earnedBadges,
      },
    });
  } catch (err) {
    console.error("getMyProfile error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load profile" });
  }
}

async function listBadges(req, res) {
  try {
    const badges = await Badge.find();
    return res.status(200).json({ success: true, data: badges });
  } catch (err) {
    console.error("listBadges error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to load badges" });
  }
}

module.exports = {
  getLeaderboard,
  getMyProfile,
  listBadges,
};
