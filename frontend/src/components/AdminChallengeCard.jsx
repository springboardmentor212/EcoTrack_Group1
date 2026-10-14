
import { useState } from "react";

const STATUS_STYLES = {
  active: "bg-green-100 text-green-700",
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS = {
  active: "Active",
  upcoming: "Upcoming",
  completed: "Ended",
};

const durationDays = (start, end) => {
  const days = Math.ceil(
    (new Date(end).getTime() - new Date(start).getTime()) /
      86400000,
  );

  return Math.max(1, days);
};

const formatDate = (value) =>
  new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

export default function AdminChallengeCard({
  challenge,
  onEdit,
  onEnd,
  onDelete,
}) {
  const [busy, setBusy] = useState(false);

  const status = challenge.status || "upcoming";
  const isActive = status === "active";
  const isCompleted = status === "completed";

  const runAction = async (action) => {
    if (busy) return;

    setBusy(true);
    try {
      await action();
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h2 className="text-lg font-semibold text-[var(--color-slate)]">
          {challenge.title}
        </h2>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            STATUS_STYLES[status] ||
            "bg-gray-100 text-gray-600"
          }`}
        >
          {STATUS_LABELS[status] || status}
        </span>
      </div>

      <p className="mt-3 text-sm text-[var(--color-muted)]">
        {challenge.description}
      </p>

      <p className="mt-3 text-xs text-[var(--color-muted)]">
        {challenge.category?.charAt(0).toUpperCase()}
        {challenge.category?.slice(1)} · Emission cap:{" "}
        {challenge.targetMetric} kg CO₂e
      </p>

      <div className="mt-4 space-y-2 text-sm">
        <p className="text-[var(--color-muted)]">
          Duration:{" "}
          {durationDays(
            challenge.startDate,
            challenge.endDate,
          )}{" "}
          days
        </p>

        <p className="text-[var(--color-muted)]">
          {formatDate(challenge.startDate)} –{" "}
          {formatDate(challenge.endDate)}
        </p>

        <p className="text-[var(--color-eco)]">
          {challenge.membersJoined ?? 0} participants
        </p>

        <p className="text-[var(--color-muted)]">
          Reward: {challenge.rewardPoints ?? 0} points
        </p>
      </div>

      <div className="mt-5 flex flex-wrap justify-end gap-2 border-t border-gray-100 pt-4">
        <button
          type="button"
          disabled={busy}
          onClick={() => runAction(() => onEdit(challenge))}
          className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 disabled:opacity-50"
        >
          Edit
        </button>

        {isActive && (
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              runAction(() => onEnd(challenge))
            }
            className="rounded-lg border border-amber-300 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50"
          >
            End Early
          </button>
        )}

        {!isCompleted && (
          <button
            type="button"
            disabled={busy}
            onClick={() =>
              runAction(() => onDelete(challenge))
            }
            className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>

      {busy && (
        <p className="mt-2 text-right text-xs text-[var(--color-muted)]">
          Please wait…
        </p>
      )}
    </article>
  );
}