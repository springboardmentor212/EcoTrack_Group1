const GamificationProfile = require('../models/GamificationProfile');
// const Badge = require('../models/Badge');
// const Goal = require('../models/Goal');
const { getCategoryEmissionsInRange } = require('../utils/aggregations');

const CATEGORIES = ['transportation', 'energy', 'food', 'waste', 'water'];

const LEVEL_THRESHOLDS = [
  { min: 90, level: 'Super Champion' },
  { min: 70, level: 'Green Advocate' },
  { min: 40, level: 'Eco Warrior' },
  { min: 0, level: 'Eco Beginner' },
];

function levelForScore(score) {
  return LEVEL_THRESHOLDS.find((t) => score >= t.min).level;
}

async function getOrCreateProfile(userId) {
  let profile = await GamificationProfile.findOne({ userId });
  if (!profile) {
    profile = await GamificationProfile.create({ userId });
  }
  return profile;
}

async function evaluateCategoryPeriod(userId, category, periodStart, periodEnd) {
  const goal = await Goal.findOne({ userId, category, status: 'active' });
  if (!goal) return null; 

  const usage = await getCategoryEmissionsInRange(userId, category, periodStart, periodEnd);
  const stayedUnderCap = usage <= goal.target;

  const profile = await getOrCreateProfile(userId);

  if (stayedUnderCap) {
    profile.ecoScore += 5;
    profile.rewardPoints += 10;
    profile.categoryCapStreaks[category] = (profile.categoryCapStreaks[category] || 0) + 1;
  } else {
    profile.categoryCapStreaks[category] = 0;
  }

  profile.level = levelForScore(profile.ecoScore);
  await profile.save();

  await evaluateBadges(userId, profile);

  return { stayedUnderCap, usage, cap: goal.target, profile };
}

async function evaluateBadges(userId, profile) {
  const allBadges = await Badge.find();
  const earnedIds = new Set(profile.earnedBadges.map((b) => b.badge.toString()));
  const newlyEarned = [];

  for (const badge of allBadges) {
    if (earnedIds.has(badge._id.toString())) continue;

    if (criteriaMet(badge.criteriaKey, profile)) {
      profile.earnedBadges.push({ badge: badge._id, earnedAt: new Date() });
      newlyEarned.push(badge);
    }
  }

  if (newlyEarned.length > 0) {
    await profile.save();
  }

  return newlyEarned;
}

function criteriaMet(criteriaKey, profile) {
  const streakMatch = criteriaKey.match(/^([a-z]+)_streak_(\d+)$/);
  if (streakMatch) {
    const [, category, n] = streakMatch;
    if (!CATEGORIES.includes(category)) return false;
    return (profile.categoryCapStreaks[category] || 0) >= Number(n);
  }

  const scoreMatch = criteriaKey.match(/^eco_score_(\d+)$/);
  if (scoreMatch) {
    return profile.ecoScore >= Number(scoreMatch[1]);
  }

  return false;
}

module.exports = {
  getOrCreateProfile,
  evaluateCategoryPeriod,
  evaluateBadges,
  levelForScore,
};
