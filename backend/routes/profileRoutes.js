const express = require("express");
const protect = require("../middleware/authMiddleware");
const {
  getProfile,
  updateProfile,
  deleteAccount,
} = require("../controllers/profileController");

const router = express.Router();

router.use(protect);

router.route("/").get(getProfile).put(updateProfile).delete(deleteAccount);

module.exports = router;
