const express = require("express");
const router = express.Router();
console.log("CHALLENGE ROUTES FILE LOADED");
const authMiddleware = require("../middleware/authMiddleware");

const {
  createChallenge,
  listChallenges,
  getChallengeDetail,
  joinChallenge,
  refreshMyProgress,
  endChallengeEarly,
  deleteChallenge,
} = require("../controllers/challengeController");

// Temporary test route - no token required
router.get("/test", (req, res) => {
  console.log("CHALLENGE TEST ROUTE HIT");

  res.status(200).json({
    success: true,
    message: "Challenge route is working",
  });
});

// Authentication for the remaining routes
router.use(authMiddleware);

router.post("/", createChallenge);
router.get("/", listChallenges);
router.post("/:id/join", joinChallenge);
router.get("/:id/progress", refreshMyProgress);
router.patch("/:id/end", endChallengeEarly);
router.delete("/:id", deleteChallenge);
router.get("/:id", getChallengeDetail);

module.exports = router;