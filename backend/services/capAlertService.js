const Goal = require("../models/Goal");
const { getAllCategoryEmissionsInRange } = require("../utils/aggregations");
const { createNotification } = require("./notificationService");

const WARN_AT = 0.8; // 80% of the cap

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

const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Called after a carbon entry is created/updated.
 * Notifies once per goal per period at 80% and at 100% of the cap.
 * Never throws, so it can't break the carbon API response.
 */
async function checkCapAndNotify(userId, category) {
  try {
    if (!category) return;

    const goals = await Goal.find({
      userId,
      category: { $regex: `^${escapeRegex(category)}$`, $options: "i" },
      status: { $nin: ["completed", "paused"] },
    });
    if (!goals.length) return;

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    for (const goal of goals) {
      if (!goal.target || goal.target <= 0) continue;

      const periodStart = getPeriodStart(goal.timeframe);
      const totals = await getAllCategoryEmissionsInRange(
        userId,
        periodStart,
        endOfToday,
      );
      const used = totals[String(goal.category).toLowerCase()] || 0;
      const ratio = used / goal.target;
      const periodKey = periodStart.getTime();
      const summary = `${used.toFixed(1)} of ${goal.target} kg CO₂ used on your ${String(
        goal.timeframe,
      ).toLowerCase()} ${goal.category} goal "${goal.title}".`;

      if (ratio >= 1) {
        await createNotification({
          userId,
          type: "carbon",
          title: "Cap exceeded ⚠️",
          message: `You've gone over your cap: ${summary}`,
          dedupKey: `cap-exceeded:${goal._id}:${periodKey}`,
        });
      } else if (ratio >= WARN_AT) {
        await createNotification({
          userId,
          type: "carbon",
          title: "Approaching your cap",
          message: `You're at ${Math.round(ratio * 100)}%: ${summary}`,
          dedupKey: `cap-warning:${goal._id}:${periodKey}`,
        });
      }
    }
  } catch (err) {
    console.error("checkCapAndNotify failed:", err.message);
  }
}

module.exports = { checkCapAndNotify };