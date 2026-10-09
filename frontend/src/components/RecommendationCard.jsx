function RecommendationCard({
  category,
  title,
  description = "",
  status,
  onAccept,
  onDismiss,
}) {
  const [text] = description.split("Potential reduction:");
  const savings = description.match(/([\d.]+)\s*kg/i)?.[1];

  return (
    <div className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">
          {category}
        </span>
        {savings && (
          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
            Saves {savings} kg CO₂
          </span>
        )}
      </div>

      <h3 className="mt-3 text-base font-bold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">
        {text.trim()}
      </p>

      <div className="mt-auto flex justify-end gap-2 pt-4">
        {status === "accepted" ? (
          <span className="rounded-md bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
            Accepted ✓
          </span>
        ) : (
          <>
            <button
              onClick={onAccept}
              className="rounded-md bg-emerald-500 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-600"
            >
              Accept
            </button>
            <button
              onClick={onDismiss}
              className="rounded-md border border-sky-600 px-4 py-1.5 text-sm font-semibold text-sky-700 hover:bg-sky-50"
            >
              Dismiss
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default RecommendationCard;
