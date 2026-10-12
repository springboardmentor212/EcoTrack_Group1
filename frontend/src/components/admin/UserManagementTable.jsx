
import StatusBadge from "../StatusBadge";

export default function UserManagementTable({
  users = [],
  onView,
  onRoleChange,
  onToggleStatus,
}) {
  const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);
    return Number.isNaN(date.getTime())
      ? "—"
      : date.toLocaleDateString();
  };

  return (
    <div className="mt-6 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="w-full min-w-[1050px] text-left">
        <thead className="bg-gray-50 text-sm font-semibold text-[var(--color-slate)]">
          <tr>
            <th className="px-5 py-3">User</th>
            <th className="px-5 py-3">Email</th>
            <th className="px-5 py-3">Role</th>
            <th className="px-5 py-3">Eco Score</th>
            <th className="px-5 py-3">Joined</th>
            <th className="px-5 py-3">Status</th>
            <th className="px-5 py-3">Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.length === 0 ? (
            <tr>
              <td
                colSpan={7}
                className="px-5 py-8 text-center text-sm text-[var(--color-slate)]"
              >
                No users found.
              </td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} className="border-t border-gray-100">
                <td className="px-5 py-4 font-medium text-[var(--color-slate)]">
                  {user.name || "Unnamed user"}
                </td>

                <td className="px-5 py-4 text-sm text-[var(--color-slate)]">
                  {user.email || "—"}
                </td>

                <td className="px-5 py-4">
                  <select
                    value={user.role || "user"}
                    onChange={(event) =>
                      onRoleChange?.(user, event.target.value)
                    }
                    aria-label={`Role for ${user.name || user.email}`}
                    className="rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-[var(--color-slate)] outline-none"
                  >
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </td>

                <td className="px-5 py-4 text-sm text-[var(--color-slate)]">
                  {user.ecoScore ?? user.eco_score ?? "—"}
                </td>

                <td className="px-5 py-4 text-sm text-[var(--color-slate)]">
                  {formatDate(user.joinedAt || user.createdAt || user.created_at)}
                </td>

                <td className="px-5 py-4">
                  <StatusBadge status={user.status} />
                </td>

                <td className="px-5 py-4">
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
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}