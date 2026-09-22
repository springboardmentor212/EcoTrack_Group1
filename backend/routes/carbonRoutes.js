const express = require("express");

const {
    createCarbonEntry,
    getCarbonEntries,
    updateCarbonEntry,
    deleteCarbonEntry,
    searchCarbonEntries
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

router.get(
    "/search",
    authMiddleware,
    searchCarbonEntries
);

router.put(
    "/:id",
    authMiddleware,
    updateCarbonEntry
);

router.delete(
    "/:id",
    authMiddleware,
    deleteCarbonEntry
);

module.exports = router;