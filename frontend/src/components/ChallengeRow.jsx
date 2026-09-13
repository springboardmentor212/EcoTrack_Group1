export default function ChallengeRow({label, note}) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-400 last:border-0">
            <div>
                <p className="text-sm text-[var(--color-muted)]">{label}</p>
                <p className="text-xs text-[var(--color-slate)]">{note}</p>
            </div>
        </div>
    )
}