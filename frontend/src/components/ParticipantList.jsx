const ParticipantList = ({ participants = [], target = 0, currentUserId }) => {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--color-slate)]">
        Participants
      </h2>
      <p className="mt-1 text-xs text-[var(--color-muted)]">
        Ranked by lowest emissions
      </p>

      {participants.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--color-muted)]">
          No one has joined yet.
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          {participants.map((p) => {
            const percent =
              target > 0 ? Math.round((p.currentProgress / target) * 100) : 0;
            const isMe = String(p.userId) === String(currentUserId);

            return (
              <div
                key={p.userId}
                className={`flex items-center justify-between rounded-lg px-4 py-3 ${
                  isMe ? "bg-[var(--color-eco)]/10" : "bg-gray-50"
                }`}
              >
                <div>
                  <p className="font-medium text-[var(--color-slate)]">
                    {p.name}
                    {isMe && " (You)"}
                  </p>
                  <p className="text-xs text-[var(--color-muted)]">
                    {p.currentProgress} kg CO₂ · {percent}% of cap
                  </p>
                </div>

                <span className="text-sm font-semibold text-[var(--color-eco)]">
                  #{p.rank}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ParticipantList;
