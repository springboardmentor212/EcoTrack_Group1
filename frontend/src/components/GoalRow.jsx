export default function GoalRow({label, percent, note}) {
    return (
        <div className="mb-3">
            <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--color-muted)]">{label}</span>
                <span className="text-[var(--color-slate)] text-xs">{percent}% - {note}</span>
            </div>
            <div className="h-1.5 bg-[var(--color-background)] rounded-full overflow-hidden">
                <div className="h-full bg-[var(--color-eco)]" style={{width: `${percent}%`}}>
                </div>
            </div>
        </div>
    )
}