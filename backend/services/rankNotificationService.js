const RankSnapshot = require("../models/RankSnapshot");
const { createNotification } = require("./notificationService");

const BIG_MOVE = 3; 

/**
 * Compares the fresh scoreboard with the last saved ranks and notifies users
 * who entered the top 3 or moved a lot. The first time a user is seen, no
 * notification is sent.
 * @param {Array<{userId, rank, ecoScore}>} board
 */
async function notifyRankChanges(board) {
  if (!board.length) return;

  const snaps = await RankSnapshot.find({
    userId: { $in: board.map((r) => r.userId) },
  });
  const previous = new Map(snaps.map((s) => [String(s.userId), s.rank]));

  const ops = [];
  const jobs = [];

  for (const row of board) {
    const old = previous.get(String(row.userId));
    if (old === row.rank) continue;

    ops.push({
      updateOne: {
        filter: { userId: row.userId },
        update: { $set: { rank: row.rank, ecoScore: row.ecoScore } },
        upsert: true,
      },
    });

    if (old === undefined) continue;

    let title = null;
    let message = null;

    if (row.rank <= 3 && old > 3) {
      title = "You're in the top 3! 🥇";
      message = `You moved up to rank #${row.rank} on the leaderboard.`;
    } else if (old - row.rank >= BIG_MOVE) {
      title = "You moved up the leaderboard 📈";
      message = `You climbed from #${old} to #${row.rank}.`;
    } else if (row.rank - old >= BIG_MOVE) {
      title = "Leaderboard rank dropped";
      message = `You slipped from #${old} to #${row.rank}. Log your eco-friendly actions to climb back.`;
    }

    if (title) {
      jobs.push(
        createNotification({
          userId: row.userId,
          type: "leaderboard",
          title,
          message,
        }).catch((e) => console.error("rank notification failed:", e.message)),
      );
    }
  }

  await Promise.all(jobs);
  if (ops.length) await RankSnapshot.bulkWrite(ops);
}

module.exports = { notifyRankChanges };
