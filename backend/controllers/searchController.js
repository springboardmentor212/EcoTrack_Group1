const mongoose = require("mongoose");
const Goal = require("../models/Goal");
const CarbonEntry = require("../models/CarbonEntry");
const Challenge = require("../models/Challenge");

const challengeCategoryMap = {
  Transportation: "transportation",
  Energy: "energy",
  "Food & Diet": "food",
  Waste: "waste",
  Water: "water",
};

const escapeRegex = (str) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const search = async (req, res) => {
  try {
    const { q = "", types = "", sectors = "" } = req.query;

    const selectedTypes = types ? types.split(",") : [];
    const includeAll = selectedTypes.length === 0;

    const categories = sectors ? sectors.split(",") : [];

    const textRegex = q.trim() ? new RegExp(escapeRegex(q.trim()), "i") : null;
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

    if (includeAll || selectedTypes.includes("Challenges")) {
      const match = {};
      if (categories.length) {
        match.category = {
          $in: categories.map(
            (c) => challengeCategoryMap[c] || c.toLowerCase(),
          ),
        };
      }
      if (textRegex)
        match.$or = [
          { title: textRegex },
          { description: textRegex },
          { category: textRegex },
        ];
      const challenges = await Challenge.find(match)
        .sort({ startDate: -1 })
        .limit(10);

      challenges.forEach((c) => {
        const joined = c.participants.some((p) => p.equals(userId));
        results.push({
          id: c._id,
          type: "Challenge",
          title: c.title,
          subtitle: `${c.category} · ${c.status} · Cap: ${c.targetMetric} kg CO2e${joined ? " · Joined" : ""}`,
          link: `/challenges/${c._id}`,
        });
      });
    }

    res.status(200).json({ results, query: q });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error performing search", error: error.message });
  }
};

module.exports = { search };
