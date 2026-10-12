const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
const c = require("../controllers/adminController");

const router = express.Router();
router.use(authMiddleware, adminOnly);

const bad = (res, message) => res.status(400).json({ success: false, message });
const validId = (req, res, next) =>
  mongoose.isValidObjectId(req.params.id) ? next() : bad(res, "Invalid id.");
const validRole = (req, res, next) =>
  ["user", "admin"].includes(req.body?.role)
    ? next()
    : bad(res, "role must be 'user' or 'admin'.");
const validStatus = (req, res, next) =>
  ["active", "suspended"].includes(req.body?.status)
    ? next()
    : bad(res, "status must be 'active' or 'suspended'.");
const validQuery = (req, res, next) => {
  const { role, status } = req.query;
  if (role && !["user", "admin"].includes(role))
    return bad(res, "Invalid role filter.");
  if (status && !["active", "suspended"].includes(status))
    return bad(res, "Invalid status filter.");
  next();
};

router.get("/stats", c.getUserStats);
router.get("/", validQuery, c.listUsers);
router.get("/:id", validId, c.getUserDetail);
router.patch("/:id/role", validId, validRole, c.updateUserRole);
router.patch("/:id/status", validId, validStatus, c.updateUserStatus);

module.exports = router;
