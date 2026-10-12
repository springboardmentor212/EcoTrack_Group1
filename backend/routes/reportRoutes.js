
const express = require("express");
const router = express.Router();

const {
  createReport,
  getPastExports,
  downloadReport,
} = require("../controllers/reportController");

const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, getPastExports);
router.post("/", authMiddleware, createReport);
router.get("/:id/download", authMiddleware, downloadReport);

module.exports = router;
