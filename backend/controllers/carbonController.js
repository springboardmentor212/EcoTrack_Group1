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

const updateCarbonEntry = async (req, res) => {
    try {
        const { category, value, unit, calculatedCO2, date } = req.body;

        const carbonEntry = await CarbonEntry.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.userId,
                isDeleted: false
            },
            {
                category,
                value,
                unit,
                calculatedCO2,
                date
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!carbonEntry) {
            return res.status(404).json({
                message: "Carbon entry not found."
            });
        }

        res.status(200).json({
            message: "Carbon entry updated successfully.",
            carbonEntry
        });
    } catch (error) {
        console.error("Update carbon entry error:", error);

        res.status(500).json({
            message: "Server error."
        });
    }
};

const deleteCarbonEntry = async (req, res) => {
    try {
        const carbonEntry = await CarbonEntry.findOneAndUpdate(
            {
                _id: req.params.id,
                userId: req.user.userId,
                isDeleted: false
            },
            {
                isDeleted: true
            },
            {
                new: true
            }
        );

        if (!carbonEntry) {
            return res.status(404).json({
                message: "Carbon entry not found."
            });
        }

        res.status(200).json({
            message: "Carbon entry deleted successfully."
        });
    } catch (error) {
        console.error("Delete carbon entry error:", error);

        res.status(500).json({
            message: "Server error."
        });
    }
};

module.exports = {
    createCarbonEntry,
    getCarbonEntries,
    updateCarbonEntry,
    deleteCarbonEntry
};