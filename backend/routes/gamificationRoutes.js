const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getLeaderboard,
  getMyProfile,
  listBadges,
} = require("../controllers/gamificationController");

router.use(authMiddleware);

router.get("/leaderboards", getLeaderboard);
router.get("/gamification/profile", getMyProfile);
router.get("/badges", listBadges);

module.exports = router;
