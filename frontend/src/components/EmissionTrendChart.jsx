export default function EmissionTrendChart({ categories = [] }) {
  const numericValues = categories.map((cat) => Number(cat.value) || 0);
  const maxVal = Math.max(...numericValues, 1);

  const barWidth = 40;
  const barGap = 30;
  const chartHeight = 160;
  const barAreaHeight = 120;
  const chartWidth = categories.length * (barWidth + barGap) + barGap;

  return (
    <div className="overflow-x-auto">
      <svg width={chartWidth} height={chartHeight}>
        {numericValues.map((val, idx) => {
          const barHeight = (val / maxVal) * barAreaHeight;
          const x = idx * (barWidth + barGap) + barGap;
          const y = chartHeight - barHeight - 20;
          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              rx={6}
              fill={categories[idx].color || "blue"}
            />
          );
        })}
      </svg>

      {/* Labels */}
      <div className="flex justify-around mt-3 text-xs text-gray-600">
        {categories.map((c, i) => (
          <span key={i} className="w-16 text-center truncate">
            {c.label.split(" ")[0]}
          </span>
        ))}
      </div>
    </div>
  );
}
