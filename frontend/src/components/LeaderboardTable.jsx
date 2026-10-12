const LeaderboardTable = ({
  users = [],
  valueHeader = "Eco Score",
  extraHeader = "Title",
  emptyMessage = "No rankings yet.",
}) => {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="px-6 py-5">
        <h2 className="text-lg font-semibold text-[var(--color-slate)]">
          Rankings
        </h2>
      </div>

      <div className="grid grid-cols-12 border-t border-gray-200 bg-gray-50 px-6 py-3 text-sm font-semibold text-[var(--color-muted)]">
        <span className="col-span-2">Rank</span>
        <span className="col-span-4">User</span>
        <span className="col-span-3">{valueHeader}</span>
        <span className="col-span-3">{extraHeader}</span>
      </div>

      {users.length === 0 && (
        <p className="border-t border-gray-100 px-6 py-6 text-sm text-[var(--color-muted)]">
          {emptyMessage}
        </p>
      )}

      {users.map((user, index) => {
        const rank = index + 1;

        return (
          <div
            key={user.userId}
            className={`grid grid-cols-12 items-center border-t border-gray-100 px-6 py-4 ${
              user.isMe ? "bg-[var(--color-eco)]/10" : ""
            }`}
          >
            <div className="col-span-2">
              {rank <= 3 ? (
                <span className="text-xl">
                  {rank === 1 ? "🥇" : rank === 2 ? "🥈" : "🥉"}
                </span>
              ) : (
                <span className="text-sm font-semibold text-[var(--color-muted)]">
                  {rank}
                </span>
              )}
            </div>

            <div className="col-span-4">
              <span className="font-medium text-[var(--color-slate)]">
                {user.name}
                {user.isMe && " (You)"}
              </span>
            </div>

            <div className="col-span-3">
              <span className="rounded-full bg-[var(--color-eco)] px-3 py-1 text-xs font-semibold text-white">
                {user.value}
              </span>
            </div>

            <div className="col-span-3">
              <span className="text-sm text-[var(--color-muted)]">
                {user.extra}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LeaderboardTable;
