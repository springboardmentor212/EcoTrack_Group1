function CategoryCapProgress({ category, used, cap, unit = "kg CO₂" }) {
  const percentage = cap > 0 ? Math.min((used / cap) * 100, 100) : 0;

  return (
    <div className="mt-3">
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">
          {category}
        </span>

        <span className="text-slate-500">
          {used} / {cap} {unit}
        </span>
      </div>

      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
        <div
          className="h-full rounded-full bg-emerald-500 transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p className="mt-1 text-right text-[11px] text-slate-500">
        {Math.round(percentage)}% used
      </p>
    </div>
  );
}

export default CategoryCapProgress;