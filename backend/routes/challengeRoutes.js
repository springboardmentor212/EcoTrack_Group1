const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
const {
  createChallenge,
  updateChallenge,
  endChallenge,
  deleteChallenge,
  listChallenges,
  getMyChallenges,
  getChallengeDetail,
  joinChallenge,
  refreshMyProgress,
} = require("../controllers/challengeController");

router.use(authMiddleware);

router.post("/", adminOnly, createChallenge);
router.put("/:id", adminOnly, updateChallenge);
router.patch("/:id/end", adminOnly, endChallenge);
router.delete("/:id", adminOnly, deleteChallenge);

router.get("/", listChallenges);
router.get("/mine", getMyChallenges);
router.get("/:id", getChallengeDetail);
router.post("/:id/join", joinChallenge);
router.get("/:id/progress", refreshMyProgress);

module.exports = router;
