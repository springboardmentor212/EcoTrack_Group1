import CategoryCapProgress from "./CategoryCapProgress";

function AIInsightsWidget({ category, message, used, cap }) {
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

      {used !== undefined && cap !== undefined && (
        <CategoryCapProgress
          category={category}
          used={used}
          cap={cap}
        />
      )}
    </div>
  );
}

export default AIInsightsWidget;