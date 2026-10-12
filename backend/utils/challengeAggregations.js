const Challenge = require("../models/Challenge");
const UserChallenge = require("../models/UserChallenge");
const CarbonEntry = require("../models/CarbonEntry");

async function getChallengeMemberStats(ids) {
  const match = ids ? { challengeId: { $in: ids } } : {};
  const rows = await UserChallenge.aggregate([
    { $match: match },
    {
      $lookup: {
        from: Challenge.collection.name,
        localField: "challengeId",
        foreignField: "_id",
        as: "c",
      },
    },
    { $unwind: "$c" },
    {
      $lookup: {
        from: CarbonEntry.collection.name,
        let: {
          u: "$userId",
          cat: "$c.category",
          s: "$c.startDate",
          e: "$c.endDate",
        },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$userId", "$$u"] },
                  { $eq: ["$category", "$$cat"] },
                  { $eq: ["$isDeleted", false] },
                  { $gte: ["$date", "$$s"] },
                  { $lte: ["$date", "$$e"] },
                ],
              },
            },
          },
          { $group: { _id: null, total: { $sum: "$calculatedCO2" } } },
        ],
        as: "em",
      },
    },
    {
      $addFields: {
        used: { $ifNull: [{ $arrayElemAt: ["$em.total", 0] }, 0] },
      },
    },
    {
      $addFields: {
        pct: {
          $cond: [
            { $gt: ["$c.targetMetric", 0] },
            {
              $min: [
                100,
                { $multiply: [{ $divide: ["$used", "$c.targetMetric"] }, 100] },
              ],
            },
            0,
          ],
        },
      },
    },
    {
      $group: {
        _id: "$challengeId",
        membersJoined: { $sum: 1 },
        avgProgress: { $avg: "$pct" },
      },
    },
  ]);

  const map = new Map();
  rows.forEach((r) =>
    map.set(String(r._id), {
      membersJoined: r.membersJoined,
      avgProgress: Math.round(r.avgProgress || 0),
    }),
  );
  return map;
}

module.exports = { getChallengeMemberStats };
