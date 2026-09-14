import { Users } from "lucide-react"

export default function ChallengeRow({label, note}) {
    return (
        <div className="flex items-center justify-between py-2 px-3">
            <div className="bg-[var(--color-slate)]/8 px-3 w-full py-2 rounded-md flex items-center justify-between">
                <div>
                    <p className="text-sm text-[var(--color-muted)]">{label}</p>
                <p className="text-xs text-[var(--color-slate)]">{note}</p>
                </div>
                <Users size={16} className="text-[var(--color-eco)]" />
            </div>
        </div>
    )
}