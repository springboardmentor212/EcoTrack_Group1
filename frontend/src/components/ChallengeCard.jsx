
import { useNavigate } from "react-router-dom";

const ChallengeCard = ({
  title,
  description,
  duration,
  participants,
  status = "Active",
  onEdit,
  isAdmin,
  category,
  points = 0,
  startDate,
  endDate,
  averageProgress = 0,
  onEndEarly,
  onDelete,
}) => {
  const navigate = useNavigate();

  const normalizedStatus = String(status).toLowerCase();

  const isEnded = [
    "completed",
    "ended",
    "cancelled",
    "expired",
  ].includes(normalizedStatus);

  const progress = Math.max(
    0,
    Math.min(100, Number(averageProgress) || 0)
  );

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

  const handleCardClick = () => {
    navigate("/challenge-detail", {
      state: {
        challenge: {
          title,
          description,
          duration,
          participants,
          status,
          category,
          points,
          startDate,
          endDate,
          averageProgress: progress,
        },
      },
    });
  };

  return (
    <div
      onClick={handleCardClick}
      onKeyDown={(event) => {
        if (
          event.target === event.currentTarget &&
          (event.key === "Enter" || event.key === " ")
        ) {
          event.preventDefault();
          handleCardClick();
        }
      }}
      role="button"
      tabIndex={0}
      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      {/* Title and Status */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-slate)]">
            {title || "Untitled Challenge"}
          </h2>

          {category && (
            <span className="mt-2 inline-block rounded-full bg-sky-100 px-3 py-1 text-xs font-medium text-sky-700">
              {category}
            </span>
          )}
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${
            isEnded
              ? "bg-gray-100 text-gray-600"
              : "bg-[var(--color-eco)] text-white"
          }`}
        >
          {status}
        </span>
      </div>

      {/* Description */}
      <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
        {description}
      </p>

      {/* Members and Points */}
      <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-[var(--color-muted)]">
            Members Joined
          </p>
          <p className="mt-1 font-semibold text-[var(--color-slate)]">
            {Number(participants) || 0}
          </p>
        </div>

        <div className="rounded-lg bg-gray-50 p-3">
          <p className="text-[var(--color-muted)]">Points</p>
          <p className="mt-1 font-semibold text-[var(--color-slate)]">
            {Number(points) || 0}
          </p>
        </div>
      </div>

      {/* Average Progress */}
      <div className="mt-4">
        <div className="mb-2 flex justify-between text-sm">
          <span className="text-[var(--color-muted)]">
            Average Progress
          </span>
          <span className="font-medium text-[var(--color-slate)]">
            {progress}%
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-gray-200"
          role="progressbar"
          aria-label="Average challenge progress"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progress}
        >
          <div
            className="h-full rounded-full bg-[var(--color-eco)] transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Dates and Duration */}
      <div className="mt-4 space-y-1 text-sm text-[var(--color-muted)]">
        <p>Duration: {duration || "Not set"}</p>
        <p>Start Date: {formatDate(startDate)}</p>
        <p>End Date: {formatDate(endDate)}</p>
      </div>

      {/* Actions */}
      <div className="mt-5 flex flex-wrap gap-3">
        {isAdmin && !isEnded && (
          <>
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEdit?.();
              }}
              className="flex-1 rounded-lg border border-[var(--color-eco)] px-4 py-2 text-sm font-medium text-[var(--color-eco)]"
            >
              Edit
            </button>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                onEndEarly?.();
              }}
              className="flex-1 rounded-lg border border-amber-300 px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50"
            >
              End Early
            </button>
          </>
        )}

        {isAdmin && isEnded && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onDelete?.();
            }}
            className="w-full rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
          >
            Delete
          </button>
        )}

        {!isAdmin && (
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              handleCardClick();
            }}
            className="w-full rounded-lg bg-[var(--color-eco)] px-4 py-2 text-sm font-medium text-white"
          >
            {isEnded ? "View Details" : "Join"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ChallengeCard;
