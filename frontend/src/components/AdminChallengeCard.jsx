
import {
  CalendarDays,
  Users,
  Trophy,
  Pencil,
  Ban,
  Trash2,
} from "lucide-react";

export default function AdminChallengeCard({
  challenge,
  onEdit,
  onEndEarly,
  onDelete,
}) {
  if (!challenge) return null;

  const title = challenge.title || "Untitled Challenge";
  const category = challenge.category || "General";
  const points = Number(challenge.points ?? 0);

  const membersJoined = Number(
    challenge.membersJoined ??
      challenge.participantsCount ??
      challenge.participants?.length ??
      0
  );

  const averageProgress = Math.max(
    0,
    Math.min(
      100,
      Number(
        challenge.averageProgress ??
          challenge.averageProgressPercentage ??
          challenge.progress ??
          0
      )
    )
  );

  const status = String(challenge.status || "").toLowerCase();

  // Use the saved challenge status instead of Date.now()
  // to keep rendering pure and predictable.
  const isEnded = [
    "ended",
    "completed",
    "cancelled",
    "expired",
  ].includes(status);

  const formatDate = (date) => {
    if (!date) return "Not set";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Not set";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      {/* Challenge title and category */}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-lg font-semibold text-slate-900">
            {title}
          </h3>

          <span className="mt-2 inline-flex rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
            {category}
          </span>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            isEnded
              ? "bg-slate-100 text-slate-600"
              : "bg-emerald-100 text-emerald-700"
          }`}
        >
          {isEnded ? "Ended" : "Active"}
        </span>
      </div>

      {/* Members and points */}
      <div className="mt-5 grid grid-cols-2 gap-4">
        <div className="rounded-lg bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-slate-500">
            <Users size={17} />
            <span className="text-xs">Members Joined</span>
          </div>

          <p className="mt-2 text-xl font-semibold text-slate-900">
            {membersJoined}
          </p>
        </div>

        <div className="rounded-lg bg-slate-50 p-3">
          <div className="flex items-center gap-2 text-slate-500">
            <Trophy size={17} />
            <span className="text-xs">Points</span>
          </div>

          <p className="mt-2 text-xl font-semibold text-slate-900">
            {points}
          </p>
        </div>
      </div>

      {/* Average progress */}
      <div className="mt-5">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">
            Average Progress
          </span>

          <span className="text-sm font-semibold text-slate-900">
            {averageProgress}%
          </span>
        </div>

        <div
          className="h-2.5 w-full overflow-hidden rounded-full bg-slate-200"
          role="progressbar"
          aria-label="Average challenge progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={averageProgress}
        >
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-300"
            style={{ width: `${averageProgress}%` }}
          />
        </div>
      </div>

      {/* Dates */}
      <div className="mt-5 flex items-start gap-2 text-sm text-slate-600">
        <CalendarDays size={18} className="mt-0.5 shrink-0" />

        <div>
          <p>Start: {formatDate(challenge.startDate)}</p>
          <p className="mt-1">End: {formatDate(challenge.endDate)}</p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-5 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
        {!isEnded && (
          <>
            <button
              type="button"
              onClick={() => onEdit?.(challenge)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <Pencil size={15} />
              Edit
            </button>

            <button
              type="button"
              onClick={() => onEndEarly?.(challenge)}
              className="inline-flex items-center gap-2 rounded-lg border border-amber-300 px-3 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
            >
              <Ban size={15} />
              End Early
            </button>
          </>
        )}

        {isEnded && (
          <button
            type="button"
            onClick={() => onDelete?.(challenge)}
            className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            <Trash2 size={15} />
            Delete
          </button>
        )}
      </div>
    </article>
  );
}
