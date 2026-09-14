export default function StatCard({ label, value, trend, trendGood = true, badge }) {
    return (
        <div className="bg-[var(--color-surface)] rounded-2xl p-4 shadow-sm border-2 border-[var(--color-accent)]">
            <p className="text-xs text-[var(--color-slate)] mb-1">{label}</p>
            <div className="flex items-center gap-4">
                <p className="text-2xl font-bold text-[var(--color-primary)]">{value}</p>
                {badge && (
                    <span className="text-xs bg-[var(--color-eco)]/10 text-[var(--color-eco)] px-2 py-0.5 rounded-full ml-4 font-semibold">
                        {badge}
                    </span>
                )}
            </div>
            {trend && (
                <p className={`text-xs mt-1 ${trendGood ? "text-[var(--color-eco)]" : "text-red-500"}`}>
                    {trend}
                </p>
            )}
        </div>
    )
}