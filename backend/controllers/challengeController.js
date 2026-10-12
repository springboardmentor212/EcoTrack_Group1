
const Challenge = require("../models/Challenge");
const UserChallenge = require("../models/UserChallenge");
const { getCategoryEmissionsInRange } = require("../utils/aggregations");
const { createNotification } = require("../services/notificationService");

async function createChallenge(req, res) {
  try {
    const { title, description, category, startDate, endDate, targetMetric } =
      req.body;

    if (
      !title ||
      !category ||
      !startDate ||
      !endDate ||
      targetMetric === undefined
    ) {
      return res.status(400).json({
        success: false,
        message:
          "title, category, startDate, endDate and targetMetric are required",
      });
    }

    const challenge = await Challenge.create({
      title,
      description,
      category,
      startDate,
      endDate,
      targetMetric,
      createdBy: req.user.id,
      participants: [],
    });

    return res.status(201).json({ success: true, data: challenge });
  } catch (err) {
    console.error("createChallenge error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to create challenge",
    });
  }
}

async function listChallenges(req, res) {
  try {
    const { category, status } = req.query;
    const filter = {};

    if (category && category !== "all") filter.category = category;
    if (status) filter.status = status;

    const challenges = await Challenge.find(filter).sort({ startDate: -1 });

    return res.status(200).json({ success: true, data: challenges });
  } catch (err) {
    console.error("listChallenges error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to list challenges",
    });
  }
}

async function getChallengeDetail(req, res) {
  try {
    const { id } = req.params;

    const challenge = await Challenge.findById(id).populate(
      "participants",
      "name username"
    );

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    const memberships = await UserChallenge.find({ challengeId: id })
      .populate("userId", "name username")
      .sort({ currentProgress: 1 });

    const participantList = memberships.map((m, index) => ({
      rank: index + 1,
      userId: m.userId?._id,
      name: m.userId?.name,
      currentProgress: m.currentProgress,
      status: m.status,
    }));

    return res.status(200).json({
      success: true,
      data: { challenge, participants: participantList },
    });
  } catch (err) {
    console.error("getChallengeDetail error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to load challenge detail",
    });
  }
}

async function joinChallenge(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    if (String(challenge.status).toLowerCase() !== "active") {
      return res.status(400).json({
        success: false,
        message: "This challenge is no longer active",
      });
    }

    const alreadyJoined = await UserChallenge.findOne({
      userId,
      challengeId: id,
    });

    if (alreadyJoined) {
      return res.status(409).json({
        success: false,
        message: "Already joined this challenge",
      });
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

    await createNotification({
      userId,
      title: "Challenge joined",
      message: `You joined "${challenge.title}". Log your ${challenge.category} activity to track progress.`,
      type: "challenge",
    });

    return res.status(201).json({ success: true, data: membership });
  } catch (err) {
    console.error("joinChallenge error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to join challenge",
    });
  }
}

async function refreshMyProgress(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    const membership = await UserChallenge.findOne({
      userId,
      challengeId: id,
    });

    if (!membership) {
      return res.status(404).json({
        success: false,
        message: "You have not joined this challenge",
      });
    }

    const totalEmissions = await getCategoryEmissionsInRange(
      userId,
      challenge.category,
      challenge.startDate,
      challenge.endDate
    );

    membership.currentProgress = totalEmissions;

    const now = new Date();

    if (now > challenge.endDate) {
      membership.status =
        totalEmissions <= challenge.targetMetric ? "completed" : "failed";
      membership.completedAt = membership.completedAt || now;
    } else {
      membership.status = "in_progress";
    }

    await membership.save();

    return res.status(200).json({ success: true, data: membership });
  } catch (err) {
    console.error("refreshMyProgress error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to refresh progress",
    });
  }
}

// End a challenge before its scheduled end date
async function endChallengeEarly(req, res) {
  try {
    if (String(req.user.role).toLowerCase() !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can end a challenge",
      });
    }

    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    if (String(challenge.status).toLowerCase() !== "active") {
      return res.status(400).json({
        success: false,
        message: "Only active challenges can be ended early",
      });
    }

    challenge.status = "Ended";
    challenge.endDate = new Date();

    await challenge.save();

    return res.status(200).json({
      success: true,
      message: "Challenge ended successfully",
      data: challenge,
    });
  } catch (err) {
    console.error("endChallengeEarly error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to end challenge",
    });
  }
}

// Delete a challenge and its memberships
async function deleteChallenge(req, res) {
  try {
    if (String(req.user.role).toLowerCase() !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete challenges",
      });
    }

    const challenge = await Challenge.findById(req.params.id);

    if (!challenge) {
      return res.status(404).json({
        success: false,
        message: "Challenge not found",
      });
    }

    await UserChallenge.deleteMany({ challengeId: challenge._id });
    await Challenge.findByIdAndDelete(challenge._id);

    return res.status(200).json({
      success: true,
      message: "Challenge deleted successfully",
    });
  } catch (err) {
    console.error("deleteChallenge error:", err);
    return res.status(500).json({
      success: false,
      message: "Failed to delete challenge",
    });
  }
}

module.exports = {
  createChallenge,
  listChallenges,
  getChallengeDetail,
  joinChallenge,
  refreshMyProgress,
  endChallengeEarly,
  deleteChallenge,
};
