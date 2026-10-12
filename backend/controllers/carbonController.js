const { checkCapAndNotify } = require("../services/capAlertService");
const CarbonEntry = require("../models/CarbonEntry");

const createCarbonEntry = async (req, res) => {
  try {
    const { category, value, unit, calculatedCO2, date, description } =
      req.body;
    const finalCO2 = calculatedCO2 || value || 0;
    const carbonEntry = await CarbonEntry.create({
      userId: req.user.userId,
      category,
      value,
      unit,
      calculatedCO2: finalCO2,
      date: date || undefined,
      description,
    });

    await checkCapAndNotify(req.user.userId, carbonEntry.category);
    res.status(201).json({
      message: "Carbon entry created successfully.",
      carbonEntry,
    });
  } catch (error) {
    console.error("Create carbon entry error:", error);
    res.status(500).json({
      message: "Server error.",
    });
  }
};

const getCarbonEntries = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.max(parseInt(req.query.limit) || 10, 1);
    const skip = (page - 1) * limit;

    const filter = {
      userId: req.user.userId,
      isDeleted: false,
    };

    const totalEntries = await CarbonEntry.countDocuments(filter);

    const carbonEntries = await CarbonEntry.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit);

    const totalPages = Math.ceil(totalEntries / limit);

    res.status(200).json({
      carbonEntries,
      totalPages,
      totalEntries,
    });
  } catch (error) {
    console.error("Get carbon entries error:", error);
    res.status(500).json({
      message: "Server error.",
    });
  }
};

const updateCarbonEntry = async (req, res) => {
  try {
    const { category, value, unit, calculatedCO2, description, date } =
      req.body;

    const updatedEntry = await CarbonEntry.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
        isDeleted: false,
      },
      {
        category,
        value,
        unit,
        calculatedCO2,
        description,
        date,
      },
      { new: true, runValidators: true },
    );

    if (!updatedEntry) {
      return res.status(404).json({
        message: "Carbon entry not found.",
      });
    }

    await checkCapAndNotify(req.user.userId, updatedEntry.category);

    res.status(200).json({
      message: "Carbon entry updated successfully.",
      carbonEntry: updatedEntry,
    });
  } catch (error) {
    console.error("Update carbon entry error:", error);
    res.status(500).json({
      message: "Server error.",
    });
  }
};

const getCarbonEntry = async (req, res) => {
  try {
    const carbonEntry = await CarbonEntry.findOne({
      _id: req.params.id,
      userId: req.user.userId,
      isDeleted: false,
    });

    if (!carbonEntry) {
      return res.status(404).json({
        message: "Carbon entry not found.",
      });
    }

    res.status(200).json({
      carbonEntry,
    });
  } catch (error) {
    console.error("Get carbon entry error:", error);
    res.status(500).json({
      message: "Server error.",
    });
  }
};

const deleteCarbonEntry = async (req, res) => {
  try {
    const carbonEntry = await CarbonEntry.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
        isDeleted: false,
      },
      {
        isDeleted: true,
      },
      {
        new: true,
      },
    );

    if (!carbonEntry) {
      return res.status(404).json({
        message: "Carbon entry not found.",
      });
    }

    res.status(200).json({
      message: "Carbon entry deleted successfully.",
    });
  } catch (error) {
    console.error("Delete carbon entry error:", error);
    res.status(500).json({
      message: "Server error.",
    });
  }
};

const searchCarbonEntries = async (req, res) => {
  try {
    const { category, from, to, q } = req.query;

    const filter = {
      userId: req.user.userId,
      isDeleted: false,
    };

    if (q) {
      filter.$or = [
        { description: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } },
      ];
    }

    if (category) {
      filter.category = category;
    }

    if (from || to) {
      filter.date = {};
      if (from) filter.date.$gte = new Date(from);
      if (to) {
        const endDate = new Date(to);
        endDate.setHours(23, 59, 59, 999);
        filter.date.$lte = endDate;
      }
    }

    const carbonEntries = await CarbonEntry.find(filter).sort({ date: -1 });

    res.status(200).json({
      carbonEntries,
    });
  } catch (error) {
    console.error("Search carbon entries error:", error);
    res.status(500).json({
      message: "Server error.",
    });
  }
};

module.exports = {
  createCarbonEntry,
  getCarbonEntries,
  updateCarbonEntry,
  getCarbonEntry,
  deleteCarbonEntry,
  searchCarbonEntries,
};
