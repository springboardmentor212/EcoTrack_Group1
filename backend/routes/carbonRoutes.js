const express = require("express");

const {
    createCarbonEntry,
    getCarbonEntries,
    updateCarbonEntry
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

router.put(
    "/:id",
    authMiddleware,
    validateRequiredFields(["category", "value", "unit", "calculatedCO2"]),
    updateCarbonEntry
);

module.exports = router;