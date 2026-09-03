const express = require("express");

const router = express.Router();

const {
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/authController");

// 1. Forgot Password
router.post("/forgot-password", forgotPassword);

// 2. Verify OTP
router.post("/verify-otp", verifyOTP);

// 3. Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;