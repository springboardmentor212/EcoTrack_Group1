function Field({ label, children, wide = false }) {
  return (
    <div className={wide ? "col-span-2" : ""}>
      <p className="text-xs text-[var(--color-slate)]">{label}</p>
      <p className="mt-1 break-words font-medium capitalize text-[var(--color-primary)]">
        {children}
      </p>
    </div>
  );
}

export default function UserDetailModal({ isOpen, user, onClose }) {
  if (!isOpen || !user) return null;

  const isAdmin = user.role === "admin";
  const ecoScore = user.ecoScore ?? user.eco_score;
  const entriesCount =
    user.entriesCount ?? user.entries_count ?? user.totalEntries;
  const goals = user.goalsSummary ?? user.goals_summary;
  const joinedRaw = user.joinedAt || user.createdAt || user.created_at;

  const displayValue = (value) =>
    value === undefined || value === null || value === ""
      ? "Not available"
      : value;

  const joined = joinedRaw
    ? new Date(joinedRaw).toLocaleDateString()
    : "Not available";

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
            {isAdmin ? "Admin Details" : "User Details"}
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
          <Field label="Name">{displayValue(user.name)}</Field>
          <Field label="Email">{displayValue(user.email)}</Field>
          <Field label="Role">{displayValue(user.role)}</Field>
          <Field label="Status">{displayValue(user.status)}</Field>
          <Field label="Joined">{joined}</Field>

          {!isAdmin && (
            <>
              <Field label="Eco Score">{displayValue(ecoScore)}</Field>
              <Field label="Entries Count">{displayValue(entriesCount)}</Field>
              <Field label="Goals Summary" wide>
                {goals && typeof goals === "object"
                  ? `${goals.active ?? 0} active of ${goals.total ?? 0} total`
                  : displayValue(goals)}
              </Field>
            </>
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
