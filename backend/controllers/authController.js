const User = require("../models/User");
const bcrypt = require("bcryptjs");
const transporter = require("../config/email");

// Generate a 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 1. Forgot Password - Generate and send OTP
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Generate OTP
    const otp = generateOTP();

    // Hash OTP before storing it
    const hashedOTP = await bcrypt.hash(otp, 10);

    // Save hashed OTP and expiry time
    user.resetOTP = hashedOTP;
    user.resetOTPExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // New OTP means previous verification is no longer valid
    user.resetOTPVerified = false;

    await user.save();

    // Send OTP to user's email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "EcoTrack Password Reset OTP",
      text: `Your OTP for resetting your EcoTrack password is: ${otp}. This OTP will expire in 10 minutes.`,
    });

    return res.status(200).json({
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// 2. Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        message: "Email and OTP are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check OTP expiry
    if (!user.resetOTPExpiry || user.resetOTPExpiry < new Date()) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    // Compare entered OTP with hashed OTP
    const isOTPValid = await bcrypt.compare(otp, user.resetOTP);

    if (!isOTPValid) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Mark OTP as verified
    user.resetOTPVerified = true;
    await user.save();

    return res.status(200).json({
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.error("Verify OTP error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

// 3. Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({
        message: "Email, OTP and new password are required",
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Check whether OTP was verified
    if (!user.resetOTPVerified) {
      return res.status(400).json({
        message: "Please verify OTP first",
      });
    }

    // Check OTP expiry
    if (!user.resetOTPExpiry || user.resetOTPExpiry < new Date()) {
      return res.status(400).json({
        message: "OTP has expired",
      });
    }

    // Compare entered OTP with hashed OTP
    const isOTPValid = await bcrypt.compare(otp, user.resetOTP);

    if (!isOTPValid) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    // Clear OTP data after successful password reset
    user.resetOTP = "";
    user.resetOTPExpiry = null;
    user.resetOTPVerified = false;

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

module.exports = {
  forgotPassword,
  verifyOTP,
  resetPassword,
};