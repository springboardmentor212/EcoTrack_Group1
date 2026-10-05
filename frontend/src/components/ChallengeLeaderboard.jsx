const ChallengeLeaderboard = () => {
    const leaderboard = [
        { name: "Arun", score: 950 },
        { name: "Priya", score: 820 },
        { name: "Varsha", score: 700 },
        { name: "Kavin", score: 560 }
    ];

    return (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--color-slate)]">
                Challenge Leaderboard
            </h2>

            <div className="mt-4 space-y-3">
                {leaderboard.map((user, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-semibold text-[var(--color-eco)]">
                                #{index + 1}
                            </span>

                            <span className="font-medium text-[var(--color-slate)]">
                                {user.name}
                            </span>
                        </div>

                        <span className="text-sm font-semibold text-[var(--color-muted)]">
                            {user.score} points
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChallengeLeaderboard;