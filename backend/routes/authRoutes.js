const express = require("express");
const rateLimit = require("express-rate-limit");
const router = express.Router();
const {
  registerUser,
  loginUser,
  forgotPassword,
  verifyOTP,
  resetPassword,
} = require("../controllers/authController");

// Limit OTP requests
const forgotPasswordLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // Maximum 3 requests
  message: {
    message: "Too many OTP requests. Please try again after 10 minutes.",
  },
});

router.post("/register", registerUser);
router.post("/login", loginUser);

// Forgot Password
router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  forgotPassword
);

// Verify OTP
router.post("/verify-otp", verifyOTP);

// Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;