const mongoose = require("mongoose");
const Challenge = require("../models/Challenge");
const agg = require("../utils/challengeAggregations");
const { computeStatus } = require("../utils/challengeStatus");

const CATEGORIES = ["transportation", "energy", "food", "waste", "water"];

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

    if (err.name === "CastError") {
      return fail(res, 400, "Invalid challenge data.");
    }

    console.error(err);
    return fail(res, 500, "Something went wrong. Please try again.");
  }
};

const validateBody = (body) => {
  const { title, description, category, startDate, endDate, targetMetric } =
    body || {};

  if (typeof title !== "string" || !title.trim()) {
    return "Title is required.";
  }

  if (typeof description !== "string" || !description.trim()) {
    return "Description is required.";
  }

  if (title.trim().length > 100) {
    return "Title must be 100 characters or fewer.";
  }

  if (!CATEGORIES.includes(category)) {
    return "Invalid category.";
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    return "Valid start and end dates are required.";
  }

  if (end <= start) {
    return "End date must be after the start date.";
  }

  const cap = Number(targetMetric);

  if (!Number.isFinite(cap) || cap < 0) {
    return "Emission cap must be 0 or greater.";
  }

  const points = Number(body.rewardPoints ?? 0);

  if (!Number.isFinite(points) || points < 0) {
    return "Reward points must be 0 or greater.";
  }

  return null;
};

const listChallenges = handle(async (req, res) => {
  const { status, category, search } = req.query;
  const query = {};

  if (category) {
    if (!CATEGORIES.includes(category)) {
      return fail(res, 400, "Invalid category filter.");
    }
    query.category = category;
  }

  if (search && search.trim()) {
    query.title = new RegExp(
      search.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
      "i",
    );
  }

  const challenges = await Challenge.find(query)
    .select("-participants")
    .sort({ startDate: -1 })
    .lean();

  const stats = await agg.getChallengeMemberStats(
    challenges.map((challenge) => challenge._id),
  );

  let list = challenges.map((challenge) => {
    const stat = stats.get(String(challenge._id)) || {
      membersJoined: 0,
      avgProgress: 0,
    };

    return {
      ...challenge,
      status: computeStatus(challenge),
      membersJoined: stat.membersJoined,
      avgProgress: stat.avgProgress,
    };
  });

  const counts = { active: 0, upcoming: 0, completed: 0 };
  list.forEach((challenge) => {
    counts[challenge.status]++;
  });

  if (status) {
    if (!["active", "upcoming", "ended", "completed"].includes(status)) {
      return fail(res, 400, "Invalid status filter.");
    }

    const wanted = status === "ended" ? "completed" : status;
    list = list.filter((challenge) => challenge.status === wanted);
  }

  return ok(res, { challenges: list, counts });
});

const createChallenge = handle(async (req, res) => {
  const message = validateBody(req.body);
  if (message) return fail(res, 400, message);

  const {
    title,
    description,
    category,
    startDate,
    endDate,
    targetMetric,
    rewardPoints,
  } = req.body;

  const challenge = await Challenge.create({
    title: title.trim(),
    description: description.trim(),
    category,
    startDate: new Date(startDate),
    endDate: new Date(endDate),
    targetMetric: Number(targetMetric),
    rewardPoints: Number(rewardPoints ?? 0),
    createdBy: req.user.userId,
  });

  return ok(
    res,
    { ...challenge.toObject(), status: computeStatus(challenge) },
    "Challenge created.",
    201,
  );
});

const updateChallenge = handle(async (req, res) => {
  const message = validateBody(req.body);
  if (message) return fail(res, 400, message);

  if (!mongoose.isValidObjectId(req.params.id)) {
    return fail(res, 400, "Invalid challenge ID.");
  }

  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) return fail(res, 404, "Challenge not found.");

  if (challenge.endedAt || computeStatus(challenge) === "completed") {
    return fail(res, 400, "Ended challenges cannot be edited.");
  }

  const {
    title,
    description,
    category,
    startDate,
    endDate,
    targetMetric,
    rewardPoints,
  } = req.body;

  challenge.title = title.trim();
  challenge.description = description.trim();
  challenge.category = category;
  challenge.startDate = new Date(startDate);
  challenge.endDate = new Date(endDate);
  challenge.targetMetric = Number(targetMetric);
  challenge.rewardPoints = Number(rewardPoints ?? 0);

  await challenge.save();

  return ok(
    res,
    { ...challenge.toObject(), status: computeStatus(challenge) },
    "Challenge updated.",
  );
});

const endChallenge = handle(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return fail(res, 400, "Invalid challenge ID.");
  }

  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) return fail(res, 404, "Challenge not found.");

  if (challenge.endedAt || computeStatus(challenge) === "completed") {
    return fail(res, 400, "This challenge has already ended.");
  }

  challenge.endedAt = new Date();
  challenge.status = "completed";
  await challenge.save();

  return ok(
    res,
    { ...challenge.toObject(), status: "completed" },
    "Challenge ended successfully.",
  );
});

const deleteChallenge = handle(async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return fail(res, 400, "Invalid challenge ID.");
  }

  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) return fail(res, 404, "Challenge not found.");

  await challenge.deleteOne();

  return ok(res, { id: req.params.id }, "Challenge deleted successfully.");
});

module.exports = {
  listChallenges,
  createChallenge,
  updateChallenge,
  endChallenge,
  deleteChallenge,
};
