const CarbonEntry = require("../models/CarbonEntry");

const createCarbonEntry = async (req, res) => {
    try {
        const { category, value, unit, calculatedCO2, date } = req.body;

        const carbonEntry = await CarbonEntry.create({
            userId: req.user.userId,
            category,
            value,
            unit,
            calculatedCO2,
            date
        });

        res.status(201).json({
            message: "Carbon entry created successfully.",
            carbonEntry
        });
    } catch (error) {
        console.error("Create carbon entry error:", error);

        res.status(500).json({
            message: "Server error."
        });
    }
};

module.exports = { createCarbonEntry };