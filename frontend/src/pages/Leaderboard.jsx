import { useState } from "react";
import LeaderboardTable from "../components/LeaderboardTable";
import BadgeGrid from "../components/BadgeGrid";

const Leaderboard = () => {
    const [activeTab, setActiveTab] = useState("Global");

    const globalUsers = [
        { name: "Arun", score: 1250 },
        { name: "Priya", score: 1100 },
        { name: "Varsha", score: 980 },
        { name: "Kavin", score: 850 }
    ];

    const challengeUsers = [
        { name: "Arun", score: 950 },
        { name: "Priya", score: 820 },
        { name: "Varsha", score: 700 },
        { name: "Kavin", score: 560 }
    ];

    const users =
        activeTab === "Global"
            ? globalUsers
            : challengeUsers;

    return (
        <div className="p-6">

            {/* Page Header */}
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-slate)]">
                    Leaderboard
                </h1>

                <p className="mt-2 text-[var(--color-muted)]">
                    Track your sustainability ranking and achievements.
                </p>
            </div>

            {/* Tabs */}
            <div className="mt-6 flex gap-3">

                <button
                    onClick={() => setActiveTab("Global")}
                    className={`rounded-lg px-5 py-2 text-sm font-medium ${
                        activeTab === "Global"
                            ? "bg-[var(--color-eco)] text-white"
                            : "border border-gray-200 bg-white text-[var(--color-slate)]"
                    }`}
                >
                    Global
                </button>

                <button
                    onClick={() => setActiveTab("Challenge")}
                    className={`rounded-lg px-5 py-2 text-sm font-medium ${
                        activeTab === "Challenge"
                            ? "bg-[var(--color-eco)] text-white"
                            : "border border-gray-200 bg-white text-[var(--color-slate)]"
                    }`}
                >
                    Challenge
                </button>

            </div>

            {/* Badges + Leaderboard */}
            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">

                {/* Badges - Left */}
                <div>
                    <BadgeGrid />
                </div>

                {/* Leaderboard - Right */}
                <div className="lg:col-span-2">
                    <LeaderboardTable users={users} />
                </div>

            </div>

        </div>
    );
};

export default Leaderboard;