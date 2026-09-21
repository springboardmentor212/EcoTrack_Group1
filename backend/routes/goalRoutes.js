const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createGoal,
  getGoals,
  updateGoal,
} = require("../controllers/goalController");

router.post("/", authMiddleware, createGoal);

router.get("/", authMiddleware, getGoals);

router.put("/:id", authMiddleware, updateGoal);

module.exports = router;