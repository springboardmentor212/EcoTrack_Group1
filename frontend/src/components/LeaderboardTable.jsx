import EcoScoreBadge from "./EcoScoreBadge";

const LeaderboardTable = ({ users }) => {
    return (
        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">

            {/* Header */}
            <div className="grid grid-cols-3 bg-gray-50 px-5 py-3 text-sm font-semibold text-[var(--color-slate)]">
                <span>Rank</span>
                <span>User</span>
                <span>Eco Score</span>
            </div>

            {/* Users */}
            {users.map((user, index) => {
                const rank = index + 1;

                return (
                    <div
                        key={user.name}
                        className="grid grid-cols-3 items-center border-t border-gray-100 px-5 py-4"
                    >
                        {/* Rank */}
                        <div className="flex items-center">
                            {rank === 1 ? (
                                <span className="text-2xl">🥇</span>
                            ) : rank === 2 ? (
                                <span className="text-2xl">🥈</span>
                            ) : rank === 3 ? (
                                <span className="text-2xl">🥉</span>
                            ) : (
                                <span className="pl-2 text-sm font-semibold text-[var(--color-muted)]">
                                    {rank}
                                </span>
                            )}
                        </div>

                        {/* User */}
                        <span className="font-medium text-[var(--color-slate)]">
                            {user.name}
                        </span>

                        {/* Score */}
                        <EcoScoreBadge score={user.score} />
                    </div>
                );
            })}
        </div>
    );
};

export default LeaderboardTable