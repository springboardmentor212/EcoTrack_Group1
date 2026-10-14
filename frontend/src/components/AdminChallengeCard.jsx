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
    (new Date(end).getTime() - new Date(start).getTime()) / 86400000,
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

  const participants = challenge.membersJoined ?? 0;
  const days = durationDays(challenge.startDate, challenge.endDate);

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
    <article className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Title + status */}
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold leading-snug text-[var(--color-slate)]">
          {challenge.title}
        </h2>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${
            STATUS_STYLES[status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {STATUS_LABELS[status] || status}
        </span>
      </div>

      {/* Description */}
      <p
        title={challenge.description}
        className="mt-2 line-clamp-2 min-h-[3rem] text-sm leading-relaxed text-[var(--color-muted)]"
      >
        {challenge.description}
      </p>

      {/* Category + cap tags */}
      <div className="mt-3 flex flex-wrap gap-2">
        <span className="rounded-full bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700">
          {challenge.category?.charAt(0).toUpperCase()}
          {challenge.category?.slice(1)}
        </span>
        <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-medium text-amber-700">
          Emission cap: {challenge.targetMetric} kg CO₂e
        </span>
      </div>

      {/* Details */}
      <div className="mb-4 mt-3 rounded-xl bg-gray-50 p-3">
        <p className="text-sm font-medium text-gray-800">
          {formatDate(challenge.startDate)} – {formatDate(challenge.endDate)}
        </p>

        <div className="mt-3 grid grid-cols-3 gap-3 border-t border-gray-200 pt-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Duration
            </p>
            <p className="mt-0.5 text-sm font-medium text-gray-800">
              {days} {days === 1 ? "day" : "days"}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Participants
            </p>
            <p className="mt-0.5 text-sm font-semibold text-[var(--color-eco)]">
              {participants}
            </p>
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
              Reward
            </p>
            <p className="mt-0.5 text-sm font-medium text-gray-800">
              {challenge.rewardPoints ?? 0} pts
            </p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="mt-auto flex flex-wrap items-center justify-end gap-2 border-t border-gray-100 pt-4">
        {busy && (
          <span className="mr-auto text-xs text-[var(--color-muted)]">
            Please wait…
          </span>
        )}

        {!isCompleted && (
          <button
            type="button"
            disabled={busy}
            onClick={() => runAction(() => onEdit(challenge))}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10 disabled:opacity-50"
          >
            Edit
          </button>
        )}

        {isActive && (
          <button
            type="button"
            disabled={busy}
            onClick={() => runAction(() => onEnd(challenge))}
            className="rounded-lg border border-amber-300 px-3 py-1.5 text-sm font-medium text-amber-700 hover:bg-amber-50 disabled:opacity-50"
          >
            End Early
          </button>
        )}

        {!isCompleted && (
          <button
            type="button"
            disabled={busy}
            onClick={() => runAction(() => onDelete(challenge))}
            className="rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
