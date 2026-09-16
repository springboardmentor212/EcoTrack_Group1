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

const getCarbonEntries = async (req, res) => {
    try {
        const carbonEntries = await CarbonEntry.find({
            userId: req.user.userId,
            isDeleted: false
        }).sort({ date: -1 });

        res.status(200).json({
            carbonEntries
        });
    } catch (error) {
        console.error("Get carbon entries error:", error);

        res.status(500).json({
            message: "Server error."
        });
    }
};

module.exports = {
    createCarbonEntry,
    getCarbonEntries
};