const express = require("express");
const { createCarbonEntry } = require("../controllers/carbonController");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequiredFields = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    validateRequiredFields(["category", "value", "unit", "calculatedCO2"]),
    createCarbonEntry
);

module.exports = router;