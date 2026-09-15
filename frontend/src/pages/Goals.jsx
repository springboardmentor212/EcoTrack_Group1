import { useState } from "react";
import GoalCard from "../components/GoalCard";

const allGoals = [
    { id: 1, category: "Transportation", title: "Reduce Commute Carbon", percent: 100, target: "80 kg", deadline: "Nov 30, 2026", status: "Completed"},
    { id: 2, category: "Waste", title: "Compost Household Waste", percent: 65, target: "20 kg", deadline: "Dec 31, 2026", status: "On Track"},
    { id: 3, category: "Electricity", title: "Limit Electricity Usage", percent: 75, target: "90 kwh", deadline: "Dec 20, 2026", status: "On Track"},
    { id: 4, category: "Water", title: "Conserve Water Usage", percent: 40, target: "300 L", deadline: "Dec 15, 2026", status: "Behind"},
];

const tabs = ["All", "Active", "Completed", "Behind Schedule"];

export default function Goals() {
    const [tab, setTab] = useState("All");

    const filtered = allGoals.filter((g) => {
        if (tab === "All") return true;
        if (tab === "Active") return g.status === "On Track";
        if (tab === "Completed") return g.status === "Completed";
        if (tab === "Behind Schedule") return g.status === "Behind";
    });

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-primary)]">Sustainability Goals</h1>
                    <p className="text-sm text-[var(--color-slate)] mt-1">6 Active · 14 Completed This Year</p>
                </div>
                <button className="bg-[var(--color-eco)] text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:shadow-md hover:brightness-95 active:scale-[0.90] antialiased">
                    Create New Goal
                </button>
            </div>

            <div className="flex gap-2 mb-6">
                {tabs.map((t) => (
                    <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`text-sm px-4 py-1.5 rounded-full ${
                    tab === t ? "bg-[var(--color-primary)] text-white" : "bg-[var(--color-surface)] text-[var(--color-slate)]"
                }`}
                    >
                        {t}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {filtered.map((goal) => (
                    <GoalCard key={goal.id} {...goal} />
                ))}
            </div>
        </div>
    );
}