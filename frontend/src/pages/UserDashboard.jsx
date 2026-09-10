// 

import { Search, Bell, Sparkles} from "lucide-react";
import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";

const statCards = [
    {label: "Total Carbon Footprint", value: "2.4 Tons CO₂", trend: "↓ 12% vs last month", trendGood: true},
    {label: "Sustainability Score", value: "78 / 100", badge: "Eco Warrior", trend: "↑ 4% vs last month", trendGood: true},
    {label: "Active Goals", value: "5 of 7", trend: "On Track vs last month", trendGood: true},
    {label: "Challenge Rank", value: "#24 / 1,250", trend: "↑ 8 places vs last month", trendGood: true},
];

export default function UserDashboard() {
    return (
        <div className="flex h-screen bg-[var(--color-background)]">
            <Sidebar userName="Trapti" userTag="Eco Warrior" userInitial="T" />

            <main className="flex-1 overflow-y-auto h-screen p-8">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Welcome Back, Trapti</h1>
                        <p className="text-sm text-[var(--color-slate)] mt-1">
                            Today is Thursday, Oct 24 - Let's hit your green targets today!
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="relative">
                            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate)]"/>
                            <input
                            placeholder="Search sustainability data..."
                            className="pl-9 pr-4 py-2 rounded-lg border border-[var(-color-slate)] text-sm outline-none w-64"
                            />
                        </div>
                        <Bell size={20} className="text-[var(--color-slate)]" />
                        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400"></div>
                    </div>
                </div>

                <div className="grid grid-cols-4 gap-4 mb-6">
                    {statCards.map((card, i) => (
                        <StatCard key={i} {...card} />
                    ))}
                </div>
            </main>
        </div>
    )
}