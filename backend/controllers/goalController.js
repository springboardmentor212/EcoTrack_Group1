const mongoose = require("mongoose");
const Goal = require("../models/Goal");
const CarbonEntry = require("../models/CarbonEntry");
const { createNotification } = require("../services/notificationService");
const DAY_MS = 24 * 60 * 60 * 1000;

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

const calculateCurrentValue = async (userId, category, timeframe) => {
  const periodStart = getPeriodStart(timeframe);

  const result = await CarbonEntry.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        category: { $regex: `^${category}$`, $options: "i" },
        date: { $gte: periodStart },
        isDeleted: { $ne: true },
      },
    },
    { $group: { _id: null, total: { $sum: "$calculatedCO2" } } },
  ]);

  return result.length ? Number(result[0].total.toFixed(2)) : 0;
};

const refreshGoal = async (goal, userId) => {
  if (goal.status === "completed") return goal;
  const currentValue = await calculateCurrentValue(
    userId,
    goal.category,
    goal.timeframe,
  );
  if (currentValue !== goal.currentValue) {
    goal.currentValue = currentValue;
    await goal.save();
  }
  return goal;
};

const checkGoalDeadlines = async (goals, userId) => {
  const now = new Date();
  for (const g of goals) {
    if (g.status === "completed" || !g.deadline) continue;
    const daysLeft = Math.ceil((new Date(g.deadline) - now) / DAY_MS);
    try {
      if (daysLeft < 0) {
        await createNotification({
          userId,
          type: "goal",
          title: "Goal deadline passed",
          message: `The deadline for "${g.title}" has passed. Update or complete it.`,
          dedupKey: `goal-overdue:${g._id}`,
        });
      } else if (daysLeft <= 3) {
        await createNotification({
          userId,
          type: "goal",
          title: "Goal deadline coming up",
          message: `"${g.title}" is due in ${daysLeft} day${daysLeft === 1 ? "" : "s"}.`,
          dedupKey: `goal-deadline:${g._id}`,
        });
      }
    } catch (e) {
      console.error("goal deadline notification failed:", e.message);
    }
  }
};

const createGoal = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      target,
      timeframe,
      deadline,
      milestones,
    } = req.body;

    if (!title || !category || !target || !timeframe || !deadline) {
      return res
        .status(400)
        .json({ message: "All required fields must be provided" });
    }

    const goal = await Goal.create({
      userId: req.user.userId,
      title,
      description,
      category,
      target,
      timeframe,
      unit: "kg CO2",
      deadline,
      milestones,
    });

    try {
      await createNotification({
        userId: req.user.userId,
        type: "goal",
        title: "Goal created",
        message: `Your goal "${goal.title}" is set: stay under ${goal.target} kg CO₂ for ${goal.category} (${goal.timeframe}).`,
      });
    } catch (e) {
      console.error("goal created notification failed:", e.message);
    }

    res.status(201).json({ message: "Goal created successfully", goal });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating goal", error: error.message });
  }
};

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });
    const refreshed = await Promise.all(
      goals.map((g) => refreshGoal(g, req.user.userId)),
    );
    checkGoalDeadlines(refreshed, req.user.userId);
    res.status(200).json({ goals: refreshed });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching goals", error: error.message });
  }
};

const getGoalById = async (req, res) => {
  try {
    const goal = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }
    await refreshGoal(goal, req.user.userId);
    res.status(200).json({ goal });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching goal", error: error.message });
  }
};

const updateGoal = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      target,
      timeframe,
      deadline,
      milestones,
      status,
    } = req.body;

    const before = await Goal.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    }).select("status");

    const goal = await Goal.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      {
        title,
        description,
        category,
        target,
        timeframe,
        deadline,
        milestones,
        status,
      },
      { returnDocument: "after", runValidators: true },
    );

    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    await refreshGoal(goal, req.user.userId);

    try {
      if (status === "completed" && before && before.status !== "completed") {
        await createNotification({
          userId: req.user.userId,
          type: "goal",
          title: "Goal completed 🎉",
          message: `You completed "${goal.title}". Nice work!`,
        });
      } else {
        await createNotification({
          userId: req.user.userId,
          type: "goal",
          title: "Goal updated",
          message: `Your goal "${goal.title}" was updated.`,
        });
      }
    } catch (e) {
      console.error("goal update notification failed:", e.message);
    }

    res.status(200).json({ message: "Goal updated successfully", goal });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error updating goal", error: error.message });
  }
};

const deleteGoal = async (req, res) => {
  try {
    const goal = await Goal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    });
    if (!goal) {
      return res.status(404).json({ message: "Goal not found" });
    }

    try {
      await createNotification({
        userId: req.user.userId,
        type: "goal",
        title: "Goal deleted",
        message: `Your goal "${goal.title}" was deleted.`,
      });
    } catch (e) {
      console.error("goal delete notification failed:", e.message);
    }
    res.status(200).json({ message: "Goal deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error deleting goal", error: error.message });
  }
};

module.exports = { createGoal, getGoals, getGoalById, updateGoal, deleteGoal };
