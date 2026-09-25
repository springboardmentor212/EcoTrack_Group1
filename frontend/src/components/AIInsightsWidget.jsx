function AIInsightsWidget({ category, message }) {
  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4">
      <h2 className="text-sm font-semibold text-gray-900">
        Insight
      </h2>

      <p className="mt-2 text-xs text-gray-600">
        Your <span className="font-semibold">{category}</span> emissions
        are closest to going over this month's cap. {message}
      </p>
    </div>
  );
}

export default AIInsightsWidget;