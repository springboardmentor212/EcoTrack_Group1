const express = require("express");
const mongoose = require("mongoose");
const authMiddleware = require("../middleware/authMiddleware");
const { adminOnly } = require("../middleware/roleMiddleware");
const c = require("../controllers/reportController");

const router = express.Router();
router.use(authMiddleware, adminOnly);

const validId = (req, res, next) =>
  mongoose.isValidObjectId(req.params.id)
    ? next()
    : res.status(400).json({ success: false, message: "Invalid id." });

router.post("/export", c.exportReport);
router.get("/history", c.getHistory);
router.get("/:id/download", validId, c.downloadReport);
router.get("/preview", c.getPreview);

module.exports = router;
