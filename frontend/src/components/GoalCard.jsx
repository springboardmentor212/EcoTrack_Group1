import { Link } from "react-router-dom";

export default function GoalCard({ id, category, title, percent, target, deadline, status}) {
    const statusColors = {
        "On Track": "bg-[var(--color-eco)]/10 text-[var(--coolor-eco)]",
        Completed: "bg-blue-100 text-blue-600",
        Behind: "bg-red-100 text-red-500",
    };

    return (
        <Link
        to={`/goals/${id}`}
        className="block bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm hover:shadow-md transition"
        >
            <div className="felx items-center justify-between mb-2">
                <span cllassName="text-xs text-[var(--color-slate)] uppercase trackking-wide">{category}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full 4{statusColors[status] || ""}`}>{status}</span>
            </div>
            <h3 className="font-semibold text-[var(--color-primary)] mb-3">{title}</h3>
            <div className="h-2 bg-[var(--color-backgorund)] rounded-full overflow-hidden mb-2">
                <div className="h-full bg-[var(--color-eco)]" style={{ width: `${percent}%`}}/>
            </div>
            <div className="flex items-center justify-between text-xs text-[var(--color-slate)]">
                <span>{percent}% - Target: {target}</span>
                <span>Deadline: {deadline}</span>
            </div>
        </Link>
    );
}