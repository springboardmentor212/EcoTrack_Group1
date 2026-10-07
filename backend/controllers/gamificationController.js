const { getOrCreateProfile } = require("../services/gamificationService");
const { getScoreboard } = require("../services/scoreService");
const { syncBadges } = require("../services/badgeService");

async function getLeaderboard(req, res) {
  try {
    const limit = Math.min(50, parseInt(req.query.limit, 10) || 20);
    const userId = String(req.user.userId);

    const board = await getScoreboard();

    const data = board
      .slice(0, limit)
      .map((r) => ({ ...r, isMe: String(r.userId) === userId }));

    const mine = board.find((r) => String(r.userId) === userId);

    return res.status(200).json({
      success: true,
      data,
      me: mine
        ? { rank: mine.rank, ecoScore: mine.ecoScore, level: mine.level }
        : null,
      total: board.length,
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
    const userId = req.user.userId;
    await syncBadges(userId);

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
    const { badges, rewardPoints } = await syncBadges(req.user.userId);
    return res.status(200).json({
      success: true,
      data: badges,
      rewardPoints,
      earnedCount: badges.filter((b) => b.earned).length,
    });
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
