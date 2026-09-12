export default function ActivityRow({text, time}) {
    return (
        <div className="py-2 border-b border-[var(--color-accent)] last:border-0">
            <p className="text-sm text-[var(--color-muted)]">{text}</p>
            <p className="text-xs text-[var(--color-slate)]">{time}</p>
        </div>
    )
}