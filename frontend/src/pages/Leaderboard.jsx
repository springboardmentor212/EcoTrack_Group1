import { useState } from "react";
import LeaderboardTable from "../components/LeaderboardTable";
import BadgeGrid from "../components/BadgeGrid";

const Leaderboard = () => {
    const [activeTab, setActiveTab] = useState("Global");

    const globalUsers = [
        {
            name: "Trapti",
            score: 98,
            title: "Super Champion"
        },
        {
            name: "Parimka",
            score: 94,
            title: "Green Advocate"
        },
        {
            name: "Dharmendra",
            score: 89,
            title: "Eco Mentor"
        },
        {
            name: "Varsha",
            score: 80,
            title: "Eco Warrior"
        }
    ];

    const challengeUsers = [
        {
            name: "Arun",
            score: 95,
            title: "Super Champion"
        },
        {
            name: "Priya",
            score: 88,
            title: "Green Advocate"
        },
        {
            name: "Varsha",
            score: 80,
            title: "Eco Warrior"
        },
        {
            name: "Kavin",
            score: 72,
            title: "Eco Starter"
        }
    ];

    const users =
        activeTab === "Global"
            ? globalUsers
            : challengeUsers;

    return (
        <div className="p-6">
            {/* Page Header */}
            <div className="flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-slate)]">
                        Leaderboard
                    </h1>

                    <p className="mt-2 text-[var(--color-muted)]">
                        Global rankings, Eco Score and badges
                    </p>
                </div>

                {/* Eco Score */}
                <div className="rounded-lg border border-gray-200 bg-white px-5 py-3 shadow-sm">
                    <p className="text-xs text-[var(--color-muted)]">
                        Eco Score
                    </p>

                    <p className="mt-1 text-2xl font-bold text-[var(--color-eco)]">
                        88
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-2 border-b border-gray-200">
                <button
                    onClick={() => setActiveTab("Global")}
                    className={`px-5 py-3 text-sm font-medium ${
                        activeTab === "Global"
                            ? "border-b-2 border-[var(--color-eco)] text-[var(--color-eco)]"
                            : "text-[var(--color-muted)]"
                    }`}
                >
                    Global
                </button>

                <button
                    onClick={() => setActiveTab("Challenge")}
                    className={`px-5 py-3 text-sm font-medium ${
                        activeTab === "Challenge"
                            ? "border-b-2 border-[var(--color-eco)] text-[var(--color-eco)]"
                            : "text-[var(--color-muted)]"
                    }`}
                >
                    This Challenge
                </button>
            </div>

            {/* Main Content */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Rankings */}
                <div className="lg:col-span-2">
                    <LeaderboardTable users={users} />
                </div>

                {/* Right Side */}
                <div className="space-y-6">

                    {/* Your Eco Score */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-[var(--color-slate)]">
                            Your Eco Score
                        </h2>

                        <div className="mt-5 flex items-center justify-center">
                            <div className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-[var(--color-eco)]">
                                <span className="text-3xl font-bold text-[var(--color-slate)]">
                                    88
                                </span>
                            </div>
                        </div>

                        <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
                            Keep improving your sustainability habits!
                        </p>
                    </div>

                    {/* Badges */}
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <BadgeGrid />
                    </div>

                </div>
            </div>
        </div>
    );
};

export default Leaderboard;