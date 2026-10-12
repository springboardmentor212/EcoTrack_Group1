const mongoose = require("mongoose");

const Profile = require("../models/Profile");
const User = require("../models/User");
const CarbonEntry = require("../models/CarbonEntry");
const Goal = require("../models/Goal");

const allowedFields = [
  "fullName",
  "phone",
  "location",
  "bio",
  "profilePicture",
  "sustainabilityPreferences",
  "environmentalInterests",
  "personalGoalPreferences",
  "lifestyleConfiguration",
];

async function findOrCreateProfile(user) {
  let profile = await Profile.findOne({ user: user._id });

  if (!profile) {
    profile = await Profile.create({
      user: user._id,
      fullName: user.name || user.fullName || user.email.split("@")[0],
    });
  }

  return profile;
}

function formatProfile(profile, user) {
  return {
    email: user.email,
    role: user.role,
    memberSince: user.createdAt || profile.createdAt,
    fullName: profile.fullName,
    phone: profile.phone,
    location: profile.location,
    bio: profile.bio,
  };
}

const getProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profile = await findOrCreateProfile(user);

    res.json(formatProfile(profile, user));
  } catch (err) {
    res.status(500).json({ message: "Could not load profile" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId || req.user.id || req.user._id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    if (
      updates.fullName !== undefined &&
      !String(updates.fullName).trim()
    ) {
      return res.status(400).json({
        message: "Full name is required",
      });
    }

    const profile = await findOrCreateProfile(user);

    profile.set(updates);

    await profile.save();

    res.json(formatProfile(profile, user));
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: err.message,
      });
    }

    res.status(500).json({
      message: "Could not update profile",
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const idString = req.user._id || req.user.userId;
    const userId = new mongoose.Types.ObjectId(idString);

    await CarbonEntry.deleteMany({ userId: userId });
    await Goal.deleteMany({ userId: userId });
    await Profile.deleteOne({ user: userId });
    await User.findByIdAndDelete(userId);

    res.json({
      message: "Account deleted successfully",
    });
  } catch (err) {
    console.error("Delete account error:", err);

    res.status(500).json({
      message: "Could not delete account",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
};