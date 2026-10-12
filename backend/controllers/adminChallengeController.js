const Challenge = require("../models/Challenge");
const agg = require("../utils/challengeAggregations");
const { computeStatus } = require("../utils/challengeStatus");

const ok = (res, data, message, code = 200) =>
  res.status(code).json({ success: true, message, data });
const fail = (res, code, message) =>
  res.status(code).json({ success: false, message });
const handle = (fn) => async (req, res) => {
  try {
    await fn(req, res);
  } catch (err) {
    console.error(err);
    fail(res, 500, "Something went wrong. Please try again.");
  }
};

const listChallenges = handle(async (req, res) => {
  const { status, category, search } = req.query;
  const q = {};
  if (category) q.category = category;
  if (search && search.trim()) {
    q.title = new RegExp(
      search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );
  }

  const challenges = await Challenge.find(q)
    .select("-participants")
    .sort({ startDate: -1 })
    .lean();
  const stats = await agg.getChallengeMemberStats(challenges.map((c) => c._id));

  let list = challenges.map((c) => {
    const s = stats.get(String(c._id)) || { membersJoined: 0, avgProgress: 0 };
    return {
      ...c,
      status: computeStatus(c),
      membersJoined: s.membersJoined,
      avgProgress: s.avgProgress,
    };
  });

  const counts = { active: 0, upcoming: 0, completed: 0 };
  list.forEach((c) => counts[c.status]++);

  if (status) {
    const wanted = status === "ended" ? "completed" : status;
    list = list.filter((c) => c.status === wanted);
  }
  ok(res, { challenges: list, counts });
});

module.exports = { listChallenges };
