const ChallengeProgressTracker = ({ used = 0, target = 0, status }) => {
  const percent = target > 0 ? Math.round((used / target) * 100) : 0;
  const over = percent > 100;
  const remaining = Math.round((target - used) * 100) / 100;

  return (
    <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-[var(--color-slate)]">
          Your Progress
        </h2>

        <span
          className={`text-sm font-semibold ${
            over ? "text-red-600" : "text-[var(--color-eco)]"
          }`}
        >
          {percent}% of cap used
        </span>
      </div>

      <div className="mt-4 h-3 w-full rounded-full bg-gray-200">
        <div
          className={`h-3 rounded-full ${
            over ? "bg-red-500" : "bg-[var(--color-eco)]"
          }`}
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>

      <p className="mt-3 text-sm text-[var(--color-muted)]">
        {used} of {target} kg CO₂ used.{" "}
        {over
          ? `You are ${Math.abs(remaining)} kg over the cap.`
          : `${remaining} kg left to stay under the cap.`}
        {status === "completed" &&
          " Challenge completed — you stayed under the cap!"}
        {status === "failed" && " Challenge ended over the cap."}
      </p>
    </div>
  );
};

export default ChallengeProgressTracker;
