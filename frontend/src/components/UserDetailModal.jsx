export default function UserDetailModal({
  isOpen,
  user,
  onClose,
}) {
  if (!isOpen || !user) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-[var(--color-surface)] p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            User Details
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="text-xl leading-none text-[var(--color-slate)] hover:text-[var(--color-primary)]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <p className="text-xs text-[var(--color-slate)]">Name</p>
            <p className="mt-1 font-medium text-[var(--color-primary)]">
              {user.name}
            </p>
          </div>

          <div>
            <p className="text-xs text-[var(--color-slate)]">Email</p>
            <p className="mt-1 font-medium text-[var(--color-primary)]">
              {user.email}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-[var(--color-slate)]">Role</p>
              <p className="mt-1 font-medium capitalize text-[var(--color-primary)]">
                {user.role}
              </p>
            </div>

            <div>
              <p className="text-xs text-[var(--color-slate)]">Status</p>
              <p className="mt-1 font-medium capitalize text-[var(--color-primary)]">
                {user.status}
              </p>
            </div>
          </div>

          {user.id && (
            <div>
              <p className="text-xs text-[var(--color-slate)]">User ID</p>
              <p className="mt-1 font-medium text-[var(--color-primary)]">
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