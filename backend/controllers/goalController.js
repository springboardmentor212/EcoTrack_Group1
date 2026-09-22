const Goal = require("../models/Goal");

const createGoal = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      target,
      timeframe,
      unit,
      deadline,
      milestones,
    } = req.body;

    if (!title || !category || !target || !timeframe || !unit || !deadline) {
      return res.status(400).json({
        message: "All required fields must be provided",
      });
    }

    const goal = await Goal.create({
      userId: req.user.userId,
      title,
      description,
      category,
      target,
      timeframe,
      unit,
      deadline,
      milestones,
    });

    res.status(201).json({
      message: "Goal created successfully",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating goal",
      error: error.message,
    });
  }
};

const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({
      userId: req.user.userId,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      goals,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching goals",
      error: error.message,
    });
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
      currentValue,
      unit,
      deadline,
      milestones,
      status,
    } = req.body;

    const goal = await Goal.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      {
        title,
        description,
        category,
        target,
        timeframe,
        currentValue,
        unit,
        deadline,
        milestones,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found",
      });
    }

    res.status(200).json({
      message: "Goal updated successfully",
      goal,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating goal",
      error: error.message,
    });
  }
};

module.exports = {
  createGoal,
  getGoals,
  updateGoal,
};