const Goal = require("../models/Goal");

const createGoal = async (req, res) => {
  try {
    const { title, target, unit, deadline } = req.body;

    if (!title || !target || !unit || !deadline) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const goal = await Goal.create({
      user: req.user.userId,
      title,
      target,
      unit,
      deadline,
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
      user: req.user.userId,
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
    const { title, target, current, unit, deadline, status } = req.body;

    const goal = await Goal.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.userId,
      },
      {
        title,
        target,
        current,
        unit,
        deadline,
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