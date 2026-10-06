export default function UserManagementTable({
  users = [],
  onView,
  onRoleChange,
  onToggleStatus,
}) {
  return (
    <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="grid grid-cols-[1.3fr_1.8fr_1fr_1fr_1.4fr] bg-gray-50 px-5 py-3 text-sm font-semibold text-[var(--color-slate)]">
        <span>User</span>
        <span>Email</span>
        <span>Role</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      {users.length === 0 ? (
        <div className="px-5 py-8 text-center text-sm text-[var(--color-slate)]">
          No users found.
        </div>
      ) : (
        users.map((user) => (
          <div
            key={user.id}
            className="grid grid-cols-[1.3fr_1.8fr_1fr_1fr_1.4fr] items-center border-t border-gray-100 px-5 py-4"
          >
            <div>
              <p className="font-medium text-[var(--color-slate)]">
                {user.name}
              </p>
            </div>

            <span className="text-sm text-[var(--color-slate)]">
              {user.email}
            </span>

            <select
              value={user.role}
              onChange={(event) => onRoleChange?.(user, event.target.value)}
              className="w-fit rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[var(--color-slate)] outline-none"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            <span
              className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
                user.status === "active"
                  ? "bg-[var(--color-eco)]/10 text-[var(--color-eco)]"
                  : "bg-red-50 text-red-500"
              }`}
            >
              {user.status === "active" ? "Active" : "Suspended"}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onView?.(user)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10"
              >
                View
              </button>

              <button
                type="button"
                onClick={() => onToggleStatus?.(user)}
                className="rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
              >
                {user.status === "active" ? "Suspend" : "Reactivate"}
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}