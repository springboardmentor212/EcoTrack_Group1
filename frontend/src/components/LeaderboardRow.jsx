export default function LeaderboardRow({rank, name, tag, pts, highlight}) {
    return (
        <div className={`flex items-center justify-between py-2 px-2 rounded-lg text-sm ${highlight ? "bg-[var(--color-eco)]/10" : ""}`}>
            <span className="w-8 text-[var(--color-slate)]">{rank}</span>
            <span className="flex-1 text-[var(--color-muted)]">{name}</span>
            <span className="text-xs text-[var(--color-slate)] mr-2">{tag}</span>
            <span className="text-xs font-medium text-[var(--color-eco)]">{pts}</span>
        </div>
    )
}