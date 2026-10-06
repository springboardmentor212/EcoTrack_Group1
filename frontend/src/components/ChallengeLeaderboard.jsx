const ChallengeLeaderboard = () => {
    const leaderboard = [
        { name: "Arun", score: 950 },
        { name: "Priya", score: 820 },
        { name: "Varsha", score: 700 },
        { name: "Kavin", score: 560 }
    ];

    return (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--color-slate)]">
                    Leaderboard
                </h2>

                <span className="text-sm text-[var(--color-muted)]">
                    Top Participants
                </span>
            </div>

            <div className="mt-5 overflow-hidden rounded-lg border border-gray-200">
                <div className="grid grid-cols-12 bg-gray-50 px-4 py-3 text-xs font-semibold uppercase text-[var(--color-muted)]">
                    <span className="col-span-2">Rank</span>
                    <span className="col-span-7">Participant</span>
                    <span className="col-span-3 text-right">Score</span>
                </div>

                <div>
                    {leaderboard.map((user, index) => (
                        <div
                            key={index}
                            className={`grid grid-cols-12 items-center px-4 py-4 ${
                                index !== leaderboard.length - 1
                                    ? "border-b border-gray-200"
                                    : ""
                            }`}
                        >
                            <div className="col-span-2">
                                <span
                                    className={`font-semibold ${
                                        index === 0
                                            ? "text-[var(--color-eco)]"
                                            : "text-[var(--color-muted)]"
                                    }`}
                                >
                                    {index + 1}
                                </span>
                            </div>

                            <div className="col-span-7">
                                <span className="font-medium text-[var(--color-slate)]">
                                    {user.name}
                                </span>
                            </div>

                            <div className="col-span-3 text-right">
                                <span className="font-semibold text-[var(--color-slate)]">
                                    {user.score}
                                </span>
                                <span className="ml-1 text-xs text-[var(--color-muted)]">
                                    points
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ChallengeLeaderboard;