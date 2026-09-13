export default function TipRow({text, note}) {
    return (
        <div className="flex items-center justify-between py-2 border-b border-slate-400 last:border-0">
            <div>
                <p className="text-sm text-[var(--color-muted)]">{text}</p>
                <p className="text-xs text-[var(--color-slate)]">{note}</p>
            </div>
            <button className="text-xs bg-[--color-eco] text-white px-3 py-1 rounded-lg">Adopt</button>
        </div>
    )
}