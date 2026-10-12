const Challenge = require("../models/Challenge");

function computeStatus(challenge, now = new Date()) {
  if (challenge.endedAt) return "completed";
  if (now > new Date(challenge.endDate)) return "completed";
  if (now < new Date(challenge.startDate)) return "upcoming";
  return "active";
}

async function syncChallengeStatuses(now = new Date()) {
  await Challenge.updateMany(
    {
      status: { $ne: "completed" },
      $or: [{ endedAt: { $ne: null } }, { endDate: { $lt: now } }],
    },
    [
      {
        $set: {
          status: "completed",
          endedAt: { $ifNull: ["$endedAt", "$endDate"] },
        },
      },
    ],
  );
  await Challenge.updateMany(
    {
      status: "upcoming",
      startDate: { $lte: now },
      endDate: { $gte: now },
      endedAt: null,
    },
    { $set: { status: "active" } },
  );
}

function startChallengeStatusJob(intervalMs = 60 * 60 * 1000) {
  const run = () =>
    syncChallengeStatuses().catch((e) =>
      console.error("Challenge status job failed:", e.message),
    );
  run();
  return setInterval(run, intervalMs);
}

module.exports = {
  computeStatus,
  syncChallengeStatuses,
  startChallengeStatusJob,
};
