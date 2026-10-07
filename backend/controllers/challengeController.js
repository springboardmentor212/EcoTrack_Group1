const mongoose = require("mongoose");
const Challenge = require("../models/Challenge");
const UserChallenge = require("../models/UserChallenge");
const User = require("../models/User");
const { getAllCategoryEmissionsInRange } = require("../utils/aggregations");
// const { createNotification } = require("../services/notificationService");

const DAY_MS = 24 * 60 * 60 * 1000;

function getStatus(challenge, now = new Date()) {
  if (now < challenge.startDate) return "upcoming";
  if (now > challenge.endDate) return "completed";
  return "active";
}

function getMembershipStatus(challenge, total, now = new Date()) {
  if (now < challenge.startDate) return "joined";
  if (now > challenge.endDate) {
    return total <= challenge.targetMetric ? "completed" : "failed";
  }
  return "in_progress";
}

function parseStart(value) {
  return new Date(value);
}

function parseEnd(value) {
  const d = new Date(value);
  d.setUTCHours(23, 59, 59, 999);
  return d;
}

async function ensureAdmin(req, res) {
  const user = await User.findById(req.user.userId).select("role");
  const role = String(user?.role || "").toLowerCase();
  if (role === "admin" || role === "administrator") return true;
  res
    .status(403)
    .json({ success: false, message: "Only admins can manage challenges" });
  return false;
}

async function getUserTotal(userId, challenge) {
  const totals = await getAllCategoryEmissionsInRange(
    userId,
    challenge.startDate,
    challenge.endDate,
  );
  return Number((totals[challenge.category] || 0).toFixed(2));
}

async function buildLeaderboard(challenge) {
  const memberships = await UserChallenge.find({
    challengeId: challenge._id,
  }).populate("userId", "name");

  const now = new Date();

  const rows = await Promise.all(
    memberships
      .filter((m) => m.userId)
      .map(async (m) => {
        const total = await getUserTotal(m.userId._id, challenge);
        const status = getMembershipStatus(challenge, total, now);

        if (m.currentProgress !== total || m.status !== status) {
          // const justCompleted =
          //   status === "completed" && m.status !== "completed";
          m.currentProgress = total;
          m.status = status;
          if (status === "completed" || status === "failed") {
            m.completedAt = m.completedAt || now;
          }
          await m.save();

          // if (justCompleted) {
          //   try {
          //     await createNotification({
          //       userId: m.userId._id,
          //       title: "Challenge completed",
          //       message: `You stayed under the cap in "${challenge.title}". Great work!`,
          //       type: "challenge",
          //     });
          //   } catch (e) {
          //     console.error("challenge notification failed:", e.message);
          //   }
          // }
        }

        return {
          userId: m.userId._id,
          name: m.userId.name,
          currentProgress: total,
          status,
        };
      }),
  );

  rows.sort((a, b) => a.currentProgress - b.currentProgress);
  return rows.map((r, i) => ({ ...r, rank: i + 1 }));
}

function sendError(res, err, fallback) {
  if (err.name === "ValidationError") {
    return res.status(400).json({ success: false, message: err.message });
  }
  console.error(fallback, err);
  return res.status(500).json({ success: false, message: fallback });
}

/* ---------- controllers ---------- */

async function createChallenge(req, res) {
  try {
    if (!(await ensureAdmin(req, res))) return;

    const { title, description, category, startDate, endDate, targetMetric } =
      req.body;

    if (
      !title ||
      !description ||
      !category ||
      !startDate ||
      !endDate ||
      targetMetric === undefined ||
      targetMetric === ""
    ) {
      return res.status(400).json({
        success: false,
        message:
          "title, description, category, startDate, endDate and targetMetric are required",
      });
    }

    const challenge = await Challenge.create({
      title,
      description,
      category,
      startDate: parseStart(startDate),
      endDate: parseEnd(endDate),
      targetMetric: Number(targetMetric),
      createdBy: req.user.userId,
      participants: [],
    });

    return res.status(201).json({ success: true, data: challenge });
  } catch (err) {
    return sendError(res, err, "Failed to create challenge");
  }
}

async function updateChallenge(req, res) {
  try {
    if (!(await ensureAdmin(req, res))) return;

    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });
    }

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });
    }

    const { title, description, category, startDate, endDate, targetMetric } =
      req.body;

    if (title !== undefined) challenge.title = title;
    if (description !== undefined) challenge.description = description;
    if (category !== undefined) challenge.category = category;
    if (startDate !== undefined) challenge.startDate = parseStart(startDate);
    if (endDate !== undefined) challenge.endDate = parseEnd(endDate);
    if (targetMetric !== undefined) {
      challenge.targetMetric = Number(targetMetric);
    }

    await challenge.save();
    return res.status(200).json({ success: true, data: challenge });
  } catch (err) {
    return sendError(res, err, "Failed to update challenge");
  }
}

async function listChallenges(req, res) {
  try {
    const userId = req.user.userId;
    const { category, status } = req.query;

    const filter = {};
    if (category && category !== "all") filter.category = category;

    const challenges = await Challenge.find(filter).sort({ startDate: -1 });

    const memberships = await UserChallenge.find({
      userId,
      challengeId: { $in: challenges.map((c) => c._id) },
    }).select("challengeId");
    const joinedIds = new Set(memberships.map((m) => m.challengeId.toString()));

    const data = challenges
      .map((c) => {
        const { participants, ...rest } = c.toObject();
        return {
          ...rest,
          status: getStatus(c),
          participantsCount: participants.length,
          joined: joinedIds.has(c._id.toString()),
        };
      })
      .filter((c) => !status || c.status === status);

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return sendError(res, err, "Failed to list challenges");
  }
}

async function getMyChallenges(req, res) {
  try {
    const userId = req.user.userId;
    const now = new Date();

    const memberships = await UserChallenge.find({ userId }).populate(
      "challengeId",
    );

    const data = await Promise.all(
      memberships
        .filter((m) => m.challengeId)
        .map(async (m) => {
          const c = m.challengeId;
          const status = getStatus(c, now);

          let rank = null;
          let currentProgress = m.currentProgress;
          let participantsCount = c.participants.length;

          if (status === "active") {
            const board = await buildLeaderboard(c);
            const mine = board.find((p) => String(p.userId) === String(userId));
            if (mine) {
              rank = mine.rank;
              currentProgress = mine.currentProgress;
            }
            participantsCount = board.length;
          }

          return {
            challengeId: c._id,
            title: c.title,
            category: c.category,
            status,
            startDate: c.startDate,
            endDate: c.endDate,
            targetMetric: c.targetMetric,
            daysLeft: Math.max(0, Math.ceil((c.endDate - now) / DAY_MS)),
            currentProgress,
            rank,
            participantsCount,
            membershipStatus: m.status,
          };
        }),
    );

    data.sort((a, b) => new Date(a.endDate) - new Date(b.endDate));

    return res.status(200).json({ success: true, data });
  } catch (err) {
    return sendError(res, err, "Failed to load your challenges");
  }
}

async function getChallengeDetail(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });
    }

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });
    }

    const participants = await buildLeaderboard(challenge);
    const myProgress =
      participants.find((p) => String(p.userId) === String(userId)) || null;

    const { participants: _ids, ...rest } = challenge.toObject();

    return res.status(200).json({
      success: true,
      data: {
        challenge: {
          ...rest,
          status: getStatus(challenge),
          participantsCount: participants.length,
        },
        participants,
        myProgress,
      },
    });
  } catch (err) {
    return sendError(res, err, "Failed to load challenge detail");
  }
}

async function joinChallenge(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });
    }

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });
    }

    if (getStatus(challenge) === "completed") {
      return res
        .status(400)
        .json({ success: false, message: "This challenge has already ended" });
    }

    const alreadyJoined = await UserChallenge.findOne({
      userId,
      challengeId: id,
    });
    if (alreadyJoined) {
      return res
        .status(409)
        .json({ success: false, message: "Already joined this challenge" });
    }

    const membership = await UserChallenge.create({
      userId,
      challengeId: id,
      status: "joined",
      currentProgress: 0,
    });

    await Challenge.findByIdAndUpdate(id, {
      $addToSet: { participants: userId },
    });

    // await createNotification({
    //   userId,
    //   title: "Challenge joined",
    //   message: `You joined "${challenge.title}". Log your ${challenge.category} activity to track progress.`,
    //   type: "challenge",
    // });

    return res.status(201).json({ success: true, data: membership });
  } catch (err) {
    return sendError(res, err, "Failed to join challenge");
  }
}

async function refreshMyProgress(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    if (!mongoose.isValidObjectId(id)) {
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });
    }

    const challenge = await Challenge.findById(id);
    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, message: "Challenge not found" });
    }

    const membership = await UserChallenge.findOne({ userId, challengeId: id });
    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "You have not joined this challenge",
      });
    }

    const total = await getUserTotal(userId, challenge);
    const now = new Date();

    membership.currentProgress = total;
    membership.status = getMembershipStatus(challenge, total, now);
    if (membership.status === "completed" || membership.status === "failed") {
      membership.completedAt = membership.completedAt || now;
    }
    await membership.save();

    return res.status(200).json({ success: true, data: membership });
  } catch (err) {
    return sendError(res, err, "Failed to refresh progress");
  }
}

module.exports = {
  createChallenge,
  updateChallenge,
  listChallenges,
  getMyChallenges,
  getChallengeDetail,
  joinChallenge,
  refreshMyProgress,
};
