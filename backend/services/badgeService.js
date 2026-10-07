const Badge = require("../models/Badge");
const { getOrCreateProfile, levelForScore } = require("./gamificationService");
const { getUserBadgeStats } = require("./scoreService");

const POINTS_PER_BADGE = 10;

function criteriaMet(key, stats) {
  let m;
  if ((m = key.match(/^entries_(\d+)$/))) {
    return stats.entryCount >= Number(m[1]);
  }
  if ((m = key.match(/^([a-z]+)_entries_(\d+)$/))) {
    return (stats.categoryEntries[m[1]] || 0) >= Number(m[2]);
  }
  if ((m = key.match(/^eco_score_(\d+)$/))) {
    return (stats.ecoScore ?? 0) >= Number(m[1]);
  }
  if ((m = key.match(/^active_days_(\d+)$/))) {
    return stats.activeDays >= Number(m[1]);
  }
  if ((m = key.match(/^under_cap_(\d+)$/))) {
    return stats.underCapGoals >= Number(m[1]);
  }
  return false;
}

async function syncBadges(userId) {
  const [stats, profile, allBadges] = await Promise.all([
    getUserBadgeStats(userId),
    getOrCreateProfile(userId),
    Badge.find().sort({ _id: 1 }),
  ]);

  const earned = new Map(
    profile.earnedBadges.map((b) => [String(b.badge), b.earnedAt]),
  );
  let changed = false;

  for (const badge of allBadges) {
    const id = String(badge._id);
    if (earned.has(id)) continue;

    if (criteriaMet(badge.criteriaKey, stats)) {
      const earnedAt = new Date();
      profile.earnedBadges.push({ badge: badge._id, earnedAt });
      profile.rewardPoints += POINTS_PER_BADGE;
      earned.set(id, earnedAt);
      changed = true;
    }
  }

  if (stats.ecoScore !== null && profile.ecoScore !== stats.ecoScore) {
    profile.ecoScore = stats.ecoScore;
    profile.level = levelForScore(stats.ecoScore);
    changed = true;
  }

  if (changed) await profile.save();

  const badges = allBadges.map((b) => ({
    _id: b._id,
    name: b.name,
    description: b.description,
    iconUrl: b.iconUrl,
    category: b.category,
    earned: earned.has(String(b._id)),
    earnedAt: earned.get(String(b._id)) || null,
  }));

  return { badges, rewardPoints: profile.rewardPoints };
}

module.exports = { syncBadges };
