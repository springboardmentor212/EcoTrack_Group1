import { useNavigate } from "react-router-dom";
import { capitalize, formatDate } from "../utils/challengeUtils";

const STATUS_STYLES = {
  active: "bg-[var(--color-eco)]/10 text-[var(--color-eco)]",
  upcoming: "bg-sky-100 text-sky-700",
  completed: "bg-gray-100 text-gray-600",
};

const ChallengeCard = ({
  id,
  title,
  description,
  duration,
  participants,
  category,
  targetMetric,
  startDate,
  endDate,
  status,
  joined,
  joining,
  onEdit,
  onJoin,
  isAdmin,
}) => {
  const navigate = useNavigate();
  const openDetail = () => navigate(`/challenges/${id}`);

  const ended = status === "completed";

  let buttonLabel = "Join";
  if (joining) buttonLabel = "Joining...";
  else if (joined) buttonLabel = "View Progress";
  else if (ended) buttonLabel = "Ended";

  return (
    <div
      onClick={openDetail}
      className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-lg font-semibold text-[var(--color-slate)]">
          {title}
        </h2>

        <span
          className={`rounded-full px-2.5 py-1 text-xs font-medium ${
            STATUS_STYLES[status] || STATUS_STYLES.active
          }`}
        >
          {capitalize(status)}
        </span>
      </div>

      <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
        {description}
      </p>

      <div className="mt-4 space-y-1 text-xs text-[var(--color-muted)]">
        <p>
          {capitalize(category)} cap: {targetMetric} kg CO₂
        </p>
        <p>
          {formatDate(startDate)} – {formatDate(endDate)}
        </p>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <span className="text-[var(--color-muted)]">Duration: {duration}</span>

        <span className="text-[var(--color-eco)]">
          {participants} participants
        </span>
      </div>

      <div className="mt-5 flex gap-3">
        {isAdmin && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex-1 rounded-lg border border-[var(--color-eco)] px-4 py-2 text-sm font-medium text-[var(--color-eco)]"
          >
            Edit
          </button>
        )}

        <button
          disabled={joining || (ended && !joined)}
          onClick={(e) => {
            e.stopPropagation();
            if (joined) openDetail();
            else onJoin();
          }}
          className={`rounded-lg bg-[var(--color-eco)] cursor-pointer px-4 py-2 text-sm font-medium text-white disabled:cursor-not-allowed disabled:opacity-50 ${
            isAdmin ? "flex-1" : "w-full"
          }`}
        >
          {buttonLabel}
        </button>
      </div>
    </div>
  );
};

export default ChallengeCard;
