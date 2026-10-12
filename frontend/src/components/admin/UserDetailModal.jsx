export default function UserDetailModal({ isOpen, user, onClose }) {
  if (!isOpen || !user) return null;

  const ecoScore = user.ecoScore ?? user.eco_score;
  const entriesCount = user.entriesCount ?? user.entries_count ?? user.totalEntries;
  const goals = user.goalsSummary ?? user.goals_summary;

  const displayValue = (value) =>
    value === undefined || value === null || value === ""
      ? "Not available"
      : value;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="user-details-title"
        className="w-full max-w-lg rounded-2xl bg-[var(--color-surface)] p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2
            id="user-details-title"
            className="text-lg font-semibold text-[var(--color-primary)]"
          >
            User Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-xl leading-none text-[var(--color-slate)] hover:text-[var(--color-primary)]"
          >
            &times;
          </button>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-[var(--color-slate)]">Name</p>
            <p className="mt-1 break-words font-medium text-[var(--color-primary)]">
              {displayValue(user.name)}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--color-slate)]">Email</p>
            <p className="mt-1 break-words font-medium text-[var(--color-primary)]">
              {displayValue(user.email)}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--color-slate)]">Role</p>
            <p className="mt-1 capitalize font-medium text-[var(--color-primary)]">
              {displayValue(user.role)}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--color-slate)]">Status</p>
            <p className="mt-1 capitalize font-medium text-[var(--color-primary)]">
              {displayValue(user.status)}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--color-slate)]">Eco Score</p>
            <p className="mt-1 font-medium text-[var(--color-primary)]">
              {displayValue(ecoScore)}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--color-slate)]">Entries Count</p>
            <p className="mt-1 font-medium text-[var(--color-primary)]">
              {displayValue(entriesCount)}
            </p>
          </div>

          <div className="col-span-2">
            <p className="text-xs text-[var(--color-slate)]">Goals Summary</p>
            <p className="mt-1 font-medium text-[var(--color-primary)]">
              {goals && typeof goals === "object"
                ? `${goals.active ?? 0} active of ${goals.total ?? 0} total`
                : displayValue(goals)}
            </p>
          </div>

          {user.id && (
            <div className="col-span-2">
              <p className="text-xs text-[var(--color-slate)]">User ID</p>
              <p className="mt-1 break-all font-medium text-[var(--color-primary)]">
                {user.id}
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg bg-[var(--color-eco)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}