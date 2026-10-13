const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
const c = require("../controllers/adminChallengeController");

const CATEGORIES = ["transportation", "energy", "food", "waste", "water"];
const router = express.Router();
router.use(authMiddleware, adminOnly);

const validQuery = (req, res, next) => {
  const { status, category } = req.query;
  if (
    status &&
    !["upcoming", "active", "ended", "completed"].includes(status)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid status filter." });
  }
  if (category && !CATEGORIES.includes(category)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid category filter." });
  }
  next();
};

const validId = (req, res, next) =>
  mongoose.isValidObjectId(req.params.id)
    ? next()
    : res.status(400).json({ success: false, message: "Invalid id." });

router.get("/", validQuery, c.listChallenges);
router.post("/", c.createChallenge);
router.put("/:id", validId, c.updateChallenge);

module.exports = router;
