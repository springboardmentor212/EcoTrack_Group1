const mongoose = require("mongoose");
const Goal = require("../models/Goal");
const CarbonEntry = require("../models/CarbonEntry");

const search = async (req, res) => {
  try {
    const { q = "", types = "", sectors = "" } = req.query;

    const selectedTypes = types ? types.split(",") : [];
    const includeAll = selectedTypes.length === 0;

    const categories = sectors ? sectors.split(",") : [];

    const textRegex = q.trim() ? new RegExp(q.trim(), "i") : null;
    const userId = new mongoose.Types.ObjectId(req.user.userId);
    const results = [];

    if (includeAll || selectedTypes.includes("Goals")) {
      const match = { userId };
      if (categories.length) match.category = { $in: categories };
      if (textRegex)
        match.$or = [{ title: textRegex }, { description: textRegex }];

      const goals = await Goal.find(match).limit(10);
      goals.forEach((g) =>
        results.push({
          id: g._id,
          type: "Goal",
          title: g.title,
          subtitle: `${g.category} · Cap: ${g.target} kg CO2 / ${g.timeframe}`,
          link: `/goals/${g._id}`,
        }),
      );
    }

    if (includeAll || selectedTypes.includes("Entries")) {
      const match = { userId };
      if (categories.length) match.category = { $in: categories };
      if (textRegex)
        match.$or = [{ description: textRegex }, { category: textRegex }];

      const entries = await CarbonEntry.find(match)
        .sort({ date: -1 })
        .limit(10);
      entries.forEach((e) =>
        results.push({
          id: e._id,
          type: "Entry",
          title: e.description || e.category,
          subtitle: `${e.category} · ${e.calculatedCO2} kg CO2`,
          link: `/carbon-tracker`,
        }),
      );
    }

    res.status(200).json({ results, query: q });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error performing search", error: error.message });
  }
};

module.exports = { search };
