const OpenAI = require("openai");
const Recommendation = require("../models/Recommendation");
const Goal = require("../models/Goal");
const { getAllCategoryEmissionsInRange } = require("../utils/aggregations");
const {
  evaluateImpact,
  resolveActionSavings,
} = require("../services/savingsCalculator");
// const { createNotification } = require("../services/notificationService");

const openai = process.env.GROQ_API_KEY
  ? new OpenAI({
      apiKey: process.env.GROQ_API_KEY,
      baseURL: "https://api.groq.com/openai/v1",
    })
  : null;

const USE_DAILY_CACHE = false;
const DAY_MS = 24 * 60 * 60 * 1000;

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

async function getRecommendations(req, res) {
  try {
    const userId = req.user.userId;

    const goals = await Goal.find({
      userId,
      source: { $ne: "recommendation" },
    }).sort({ createdAt: -1 });

    if (goals.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message:
          "No active goals yet — set a category cap to get recommendations.",
      });
    }

    const now = new Date();
    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const usageByCategory = {};
    for (const goal of goals) {
      const periodEnd = endOfToday < goal.deadline ? endOfToday : goal.deadline;
      usageByCategory[goal.category.toLowerCase()] =
        await getAllCategoryEmissionsInRange(userId, monthStart, periodEnd);
    }

    const ranked = goals
      .map((goal) => {
        const key = goal.category.toLowerCase();
        const usage = usageByCategory[key]?.[key] || 0;
        const percentUsed = goal.target > 0 ? (usage / goal.target) * 100 : 0;
        return { goal, usage, percentUsed };
      })
      .sort((a, b) => b.percentUsed - a.percentUsed)
      .slice(0, 2);

    const top = ranked[0];
    const topCap = {
      category: top.goal.category,
      usage: top.usage,
      cap: top.goal.target,
      percentUsed: top.percentUsed,
    };

    if (USE_DAILY_CACHE) {
      const startOfToday = new Date();
      startOfToday.setHours(0, 0, 0, 0);
      const existing = await Recommendation.find({
        userId,
        status: { $in: ["suggested", "accepted"] },
        createdAt: { $gte: startOfToday },
      }).sort({ impactScore: -1 });

      if (existing.length > 0) {
        return res.status(200).json({ success: true, data: existing, topCap });
      }
    }

    const created = [];
    for (const { goal, usage, percentUsed } of ranked) {
      const aiSuggestions = await callAiForSuggestions({
        category: goal.category.toLowerCase(),
        usage,
        cap: goal.target,
        percentUsed,
      });

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
          category: goal.category.toLowerCase(),
          relatedGoalId: goal._id,
          status: "suggested",
        });
        created.push(rec);
      }
    }

    // if (created.length > 0) {
    //   await createNotification({
    //     userId,
    //     title: "New recommendations ready",
    //     message: `Your ${top.goal.category} emissions are at ${Math.round(top.percentUsed)}% of this period's cap — check the new suggestions.`,
    //     type: "ai",
    //   });
    // }

    return res.status(200).json({ success: true, data: created, topCap });
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
    const userId = req.user.userId;

    const rec = await Recommendation.findOneAndUpdate(
      { _id: id, userId, status: "suggested" },
      { status: "accepted" },
      { returnDocument: "after" },
    );

    if (!rec) {
      return res.status(404).json({
        success: false,
        message: "Recommendation not found or already handled",
      });
    }

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * DAY_MS);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const [last30, thisMonth] = await Promise.all([
      getAllCategoryEmissionsInRange(userId, thirtyDaysAgo, now),
      getAllCategoryEmissionsInRange(userId, monthStart, now),
    ]);

    const baseline = last30?.[rec.category] || 0;
    const monthUsed = thisMonth?.[rec.category] || 0;

    const reduction = Math.min(rec.impactScore, baseline * 0.3);

    let target = baseline - reduction;
    target = Math.max(target, monthUsed * 1.1, 5);
    target = Math.round(target * 100) / 100;

    const goal = await Goal.create({
      userId,
      title: rec.title,
      description: rec.description,
      category: capitalize(rec.category),
      target,
      timeframe: "Monthly",
      unit: "kg CO2",
      deadline: new Date(now.getTime() + 30 * DAY_MS),
      source: "recommendation",
      recommendationId: rec._id,
    });

    return res.status(200).json({ success: true, data: rec, goal });
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
    const userId = req.user.userId;

    const rec = await Recommendation.findOneAndUpdate(
      { _id: id, userId },
      { status: "dismissed" },
      { returnDocument: "after" },
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

async function callAiForSuggestions({ category, usage, cap, percentUsed }) {
  const prompt = `You are a sustainability assistant for a carbon-tracking app.
User's "${category}" emissions: ${usage} kg CO2e used against a cap of ${cap} kg CO2e (${Math.round(percentUsed)}% used).
Suggest exactly 2 concrete, realistic actions the user could take this month to reduce "${category}" emissions. Estimated savings must be realistic for one month and not more than 30% of the current usage.
Respond ONLY with valid JSON, no markdown, no commentary, in this exact shape:
[{"actionKey":"snake_case_key","title":"short title","description":"one sentence","estimatedSavingsKg":number}]`;

  try {
    const response = await openai.chat.completions.create({
      model: "openai/gpt-oss-120b",
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
    console.error("AI suggestion call failed, using fallback:", err.message);
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
