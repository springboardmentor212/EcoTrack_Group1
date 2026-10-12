export default function UserFilters({
  search,
  role,
  status,
  onSearchChange,
  onRoleChange,
  onStatusChange,
}) {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      <input
        type="text"
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search users..."
        className="min-w-[240px] flex-1 rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-[var(--color-slate)] outline-none focus:border-[var(--color-accent)]"
      />

      <select
        value={role}
        onChange={(event) => onRoleChange(event.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-[var(--color-slate)] outline-none focus:border-[var(--color-accent)]"
      >
        <option value="all">All Roles</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value)}
        className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm text-[var(--color-slate)] outline-none focus:border-[var(--color-accent)]"
      >
        <option value="all">All Statuses</option>
        <option value="active">Active</option>
        <option value="suspended">Suspended</option>
      </select>
    </div>
  );
}