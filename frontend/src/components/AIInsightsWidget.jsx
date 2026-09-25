function AIInsightsWidget({ category, message }) {
  return (
    <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3">
      <h2 className="text-sm font-bold text-slate-900">
        Insight
      </h2>

      <p className="mt-1 text-xs text-slate-700">
        Your{" "}
        <span className="font-bold">{category}</span>{" "}
        emissions are closest to going over this month's cap (86% used).{" "}
        {message}
      </p>
    </div>
  );
}

export default AIInsightsWidget;