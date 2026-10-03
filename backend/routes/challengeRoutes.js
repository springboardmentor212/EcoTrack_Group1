const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createChallenge,
  listChallenges,
  getChallengeDetail,
  joinChallenge,
  refreshMyProgress,
} = require("../controllers/challengeController");

router.use(authMiddleware);

router.post("/", createChallenge);
router.get("/", listChallenges);
router.get("/:id", getChallengeDetail);
router.post("/:id/join", joinChallenge);
router.get("/:id/progress", refreshMyProgress);

module.exports = router;
