const OpenAI = require("openai");
// const Recommendation = require('../models/Recommendation');
// const Goal = require('../models/Goal');
const { getAllCategoryEmissionsInRange } = require("../utils/aggregations");
const {
  evaluateImpact,
  resolveActionSavings,
} = require("../services/savingsCalculator");
const { createNotification } = require("../services/notificationService");

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const CATEGORIES = ["transportation", "energy", "food", "waste", "water"];
async function getRecommendations(req, res) {
  try {
    const userId = req.user.id;
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    const existing = await Recommendation.find({
      userId,
      status: "suggested",
      createdAt: { $gte: startOfToday },
    }).sort({ impactScore: -1 });

    if (existing.length > 0) {
      return res.status(200).json({ success: true, data: existing });
    }
    const goals = await Goal.find({ userId, status: "active" });
    if (goals.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message:
          "No active goals yet — set a category cap to get recommendations.",
      });
    }
    const now = new Date();
    const usageByCategory = {};
    for (const goal of goals) {
      const periodEnd = now < goal.deadline ? now : goal.deadline;
      usageByCategory[goal.category] = await getAllCategoryEmissionsInRange(
        userId,
        goal.createdAt,
        periodEnd,
      );
    }

    const ranked = goals
      .map((goal) => {
        const usage = usageByCategory[goal.category][goal.category] || 0;
        const percentUsed = goal.target > 0 ? (usage / goal.target) * 100 : 0;
        return { goal, usage, percentUsed };
      })
      .sort((a, b) => b.percentUsed - a.percentUsed)
      .slice(0, 1);
    if (ranked.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const { goal, usage, percentUsed } = ranked[0];

    const aiSuggestions = await callOpenAiForSuggestions({
      category: goal.category,
      usage,
      cap: goal.target,
      percentUsed,
    });
    const created = [];
    for (const suggestion of aiSuggestions) {
      const estimatedSavingsKg = resolveActionSavings(
        suggestion.actionKey,
        suggestion.estimatedSavingsKg,
      );
      const impact = evaluateImpact(usage, goal.target, estimatedSavingsKg);

      const rec = await Recommendation.create({
        userId,
        title: suggestion.title,
        description: impact.bringsUnderCap
          ? `${suggestion.description} Potential reduction: ${estimatedSavingsKg} kg CO2 — brings ${goal.category} back under cap.`
          : `${suggestion.description} Potential reduction: ${estimatedSavingsKg} kg CO2.`,
        impactScore: estimatedSavingsKg,
        category: goal.category,
        relatedGoalId: goal._id,
        status: "suggested",
      });
      created.push(rec);
    }

    if (created.length > 0) {
      await createNotification({
        userId,
        title: "New recommendations ready",
        message: `Your ${goal.category} emissions are at ${Math.round(percentUsed)}% of this period's cap — check the new suggestions.`,
        type: "ai",
      });
    }

    return res.status(200).json({ success: true, data: created });
  } catch (err) {
    console.error("getRecommendations error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to generate recommendations" });
  }
}

async function acceptRecommendation(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const rec = await Recommendation.findOneAndUpdate(
      { _id: id, userId },
      { status: "accepted" },
      { new: true },
    );

    if (!rec) {
      return res
        .status(404)
        .json({ success: false, message: "Recommendation not found" });
    }

    return res.status(200).json({ success: true, data: rec });
  } catch (err) {
    console.error("acceptRecommendation error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to accept recommendation" });
  }
}

async function dismissRecommendation(req, res) {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const rec = await Recommendation.findOneAndUpdate(
      { _id: id, userId },
      { status: "dismissed" },
      { new: true },
    );

    if (!rec) {
      return res
        .status(404)
        .json({ success: false, message: "Recommendation not found" });
    }

    return res.status(200).json({ success: true, data: rec });
  } catch (err) {
    console.error("dismissRecommendation error:", err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to dismiss recommendation" });
  }
}

async function callOpenAiForSuggestions({ category, usage, cap, percentUsed }) {
  const prompt = `You are a sustainability assistant for a carbon-tracking app.
User's "${category}" emissions: ${usage} kg CO2e used against a cap of ${cap} kg CO2e (${Math.round(percentUsed)}% used).
Suggest exactly 2 concrete, realistic actions the user could take this week to reduce "${category}" emissions.
Respond ONLY with valid JSON, no markdown, no commentary, in this exact shape:
[{"actionKey":"snake_case_key","title":"short title","description":"one sentence","estimatedSavingsKg":number}]`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.4,
    });

    const raw = response.choices[0].message.content.trim();
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    throw new Error("Empty or non-array AI response");
  } catch (err) {
    console.error(
      "OpenAI suggestion call failed, using fallback:",
      err.message,
    );
    return [
      {
        actionKey: `${category}_reduce_general`,
        title: `Cut back on ${category}`,
        description: `Small, consistent changes in ${category} usage add up over the week.`,
        estimatedSavingsKg: Math.round(usage * 0.1),
      },
    ];
  }
}

module.exports = {
  getRecommendations,
  acceptRecommendation,
  dismissRecommendation,
};
