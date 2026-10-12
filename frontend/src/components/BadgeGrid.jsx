import { useEffect, useState } from "react";
import * as leaderboardService from "../services/leaderboardService";

const formatDate = (value) =>
  new Date(value).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const BadgeGrid = () => {
  const [badges, setBadges] = useState([]);
  const [rewardPoints, setRewardPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await leaderboardService.getBadges();
        setBadges(res.data.data || []);
        setRewardPoints(res.data.rewardPoints || 0);
      } catch (err) {
        setError("Could not load badges");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const earnedCount = badges.filter((b) => b.earned).length;

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--color-slate)]">
          Badges
        </h2>

        {!loading && !error && (
          <span className="text-xs text-[var(--color-muted)]">
            {earnedCount} of {badges.length} earned
          </span>
        )}
      </div>

      {!loading && !error && (
        <p className="mt-1 text-xs text-[var(--color-eco)]">
          Reward points: {rewardPoints}
        </p>
      )}

      {loading && (
        <p className="mt-4 text-sm text-[var(--color-muted)]">
          Loading badges...
        </p>
      )}
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      <div className="mt-5 grid grid-cols-3 gap-5">
        {badges.map((badge) => (
          <div
            key={badge._id}
            tabIndex={0}
            className="group relative flex flex-col items-center text-center outline-none"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-full bg-gray-50 ${
                badge.earned ? "" : "opacity-40 grayscale"
              }`}
            >
              <img
                src={badge.iconUrl}
                alt={badge.name}
                className="h-10 w-10 object-contain"
              />
            </div>

            <p
              className={`mt-2 text-xs font-medium ${
                badge.earned
                  ? "text-[var(--color-slate)]"
                  : "text-[var(--color-muted)]"
              }`}
            >
              {badge.name}
            </p>

            {/* Tooltip */}
            <div className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 hidden w-44 -translate-x-1/2 rounded-lg bg-[var(--color-primary)] px-3 py-2 text-left shadow-lg group-hover:block group-focus:block">
              <p className="text-xs font-semibold text-white">
                {badge.earned ? "Earned" : "How to earn"}
              </p>
              <p className="mt-1 text-xs leading-4 text-white/80">
                {badge.description || "Keep tracking to unlock this badge."}
              </p>
              {badge.earned && badge.earnedAt && (
                <p className="mt-1 text-[10px] text-[var(--color-eco)]">
                  Unlocked on {formatDate(badge.earnedAt)}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BadgeGrid;
