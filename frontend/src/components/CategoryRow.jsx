export default function CategoryRow({color, label, value}) {
    return (
        <li className="flex items-center justify-between">
            <span className="flex items-center gap-2 text-[var(-color-muted)]">
                <span className="h-2 w-2 rounded-full" style={{ backgorundColor: color}} />
                    {label}
            </span>
            <span className="text-[var(--color-slate)]">{value}</span>
        </li>
    );
}