import EcoScoreBadge from "./EcoScoreBadge";

const LeaderboardTable = ({ users }) => {
    return (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            {/* Header */}
            <div className="px-6 py-5">
                <h2 className="text-lg font-semibold text-[var(--color-slate)]">
                    Rankings
                </h2>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-12 border-t border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold text-[var(--color-muted)]">
                <span className="col-span-2">Rank</span>
                <span className="col-span-4">User</span>
                <span className="col-span-3">Eco Score</span>
                <span className="col-span-3">Title</span>
            </div>

            {/* Users */}
            {users.map((user, index) => {
                const rank = index + 1;

                return (
                    <div
                        key={user.name}
                        className="grid grid-cols-12 items-center border-t border-gray-100 px-6 py-4"
                    >
                        {/* Rank */}
                        <div className="col-span-2">
                            {rank <= 3 ? (
                                <span className="text-xl">
                                    {rank === 1
                                        ? "🥇"
                                        : rank === 2
                                        ? "🥈"
                                        : "🥉"}
                                </span>
                            ) : (
                                <span className="text-sm font-semibold text-[var(--color-muted)]">
                                    {rank}
                                </span>
                            )}
                        </div>

                        {/* User */}
                        <div className="col-span-4">
                            <span className="font-medium text-[var(--color-slate)]">
                                {user.name}
                            </span>
                        </div>

                        {/* Eco Score */}
                        <div className="col-span-3">
                            <EcoScoreBadge score={user.score} />
                        </div>

                        {/* Title */}
                        <div className="col-span-3">
                            <span className="text-sm text-[var(--color-muted)]">
                                {user.title}
                            </span>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default LeaderboardTable;