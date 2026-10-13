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
    if (err.name === "ValidationError") {
      const first = Object.values(err.errors || {})[0];
      return fail(res, 400, first?.message || "Invalid challenge data.");
    }
    console.error(err);
    fail(res, 500, "Something went wrong. Please try again.");
  }
};

const CATEGORIES = ["transportation", "energy", "food", "waste", "water"];

const validateBody = (body) => {
  const { title, description, category, startDate, endDate, targetMetric } =
    body || {};
  if (!title?.trim() || !description?.trim()) {
    return "Title and description are required.";
  }
  if (!CATEGORIES.includes(category)) return "Invalid category.";

  const start = new Date(startDate);
  const end = new Date(endDate);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Valid start and end dates are required.";
  }
  if (end <= start) return "End date must be after the start date.";

  const cap = Number(targetMetric);
  if (!Number.isFinite(cap) || cap < 0) {
    return "Emission cap must be a number of 0 or more.";
  }
  return null;
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

const createChallenge = handle(async (req, res) => {
  const message = validateBody(req.body);
  if (message) return fail(res, 400, message);

  const { title, description, category, startDate, endDate, targetMetric } =
    req.body;

  const challenge = await Challenge.create({
    title: title.trim(),
    description: description.trim(),
    category,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    targetMetric: Number(targetMetric),
    createdBy: req.user.userId,
  });

  ok(
    res,
    { ...challenge.toObject(), status: computeStatus(challenge) },
    "Challenge created.",
    201,
  );
});

const updateChallenge = handle(async (req, res) => {
  const message = validateBody(req.body);
  if (message) return fail(res, 400, message);

  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) return fail(res, 404, "Challenge not found.");

  const { title, description, category, startDate, endDate, targetMetric } =
    req.body;

  challenge.title = title.trim();
  challenge.description = description.trim();
  challenge.category = category;
  challenge.startDate = new Date(startDate);
  challenge.endDate = new Date(endDate);
  challenge.targetMetric = Number(targetMetric);
  await challenge.save();

  ok(
    res,
    { ...challenge.toObject(), status: computeStatus(challenge) },
    "Challenge updated.",
  );
});

module.exports = { listChallenges, createChallenge, updateChallenge };
