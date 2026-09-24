import { Link } from "react-router-dom";

export default function GoalCard({
  id,
  category,
  title,
  percent,
  barWidth,
  remaining,
  timeframe,
  deadline,
  status,
}) {
  const statusColors = {
    "On Track": "bg-[var(--color-eco)]/10 text-[var(--color-eco)]",
    "Over Cap": "bg-red-100 text-red-500",
    Completed: "bg-blue-100 text-blue-600",
    Paused: "bg-gray-100 text-gray-500",
  };

  const barColor =
    status === "Over Cap" ? "bg-red-500" : "bg-[var(--color-eco)]";
  const remainingText =
    remaining >= 0
      ? `${remaining} kg CO₂ left this ${timeframe.toLowerCase()}`
      : `${Math.abs(remaining)} kg CO₂ over cap`;

  return (
    <Link
      to={`/goals/${id}`}
      className="block bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm hover:shadow-md transition"
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-[var(--color-slate)] uppercase tracking-wide">
          {category}
        </span>
        <span
          className={`text-xs px-2 py-0.5 rounded-full ${statusColors[status] || ""}`}
        >
          {status}
        </span>
      </div>
      <h3 className="font-semibold text-[var(--color-primary)] mb-3">
        {title}
      </h3>
      <div className="h-2 bg-[var(--color-background)] rounded-full overflow-hidden mb-2">
        <div
          className={`h-full ${barColor}`}
          style={{ width: `${barWidth}%` }}
        />
      </div>
      <div className="flex items-center justify-between text-xs text-[var(--color-slate)]">
        <span>{percent}% of cap used</span>
        <span>{remainingText}</span>
      </div>
      <div className="text-xs text-[var(--color-slate)] mt-1">
        By: {deadline}
      </div>
    </Link>
  );
}
