const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  getRecommendations,
  acceptRecommendation,
  dismissRecommendation,
} = require("../controllers/recommendationController");

router.use(authMiddleware);
router.get("/", getRecommendations);
router.post("/:id/accept", acceptRecommendation);
router.post("/:id/dismiss", dismissRecommendation);

module.exports = router;
