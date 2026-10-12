const jwt = require("jsonwebtoken");
const User = require("../models/User");

const TOUCH_EVERY_MS = 10 * 60 * 1000;

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("role status lastActiveAt");
    if (!user) {
      return res.status(401).json({ message: "Invalid or expired token." });
    }
    if (user.status === "suspended") {
      return res.status(403).json({
        code: "ACCOUNT_SUSPENDED",
        message: "Your account has been suspended. Contact an administrator.",
      });
    }

    if (!user.lastActiveAt || Date.now() - user.lastActiveAt.getTime() > TOUCH_EVERY_MS) {
      User.updateOne({ _id: user._id }, { $set: { lastActiveAt: new Date() } }).catch(() => {});
    }

    req.user = { ...decoded, role: user.role }; 
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
};

module.exports = authMiddleware;
