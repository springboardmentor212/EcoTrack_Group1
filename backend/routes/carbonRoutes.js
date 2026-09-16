const express = require("express");
const {
    createCarbonEntry,
    getCarbonEntries
} = require("../controllers/carbonController");
const authMiddleware = require("../middleware/authMiddleware");
const validateRequiredFields = require("../middleware/validationMiddleware");

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    validateRequiredFields(["category", "value", "unit", "calculatedCO2"]),
    createCarbonEntry
);

router.get(
    "/",
    authMiddleware,
    getCarbonEntries
);

module.exports = router;