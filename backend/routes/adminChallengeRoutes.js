const express = require("express");
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

router.get("/", validQuery, c.listChallenges);

module.exports = router;
