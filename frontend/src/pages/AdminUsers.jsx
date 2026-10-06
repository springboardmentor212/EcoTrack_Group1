import StatCard from "../components/StatCard";
import UserManagementTable from "../components/UserManagementTable";

export default function AdminUsers() {
  const stats = [
    {
      label: "Total Users",
      value: "1,250",
      trend: "All registered users",
    },
    {
      label: "Active Users",
      value: "1,180",
      trend: "94.4% of total",
      trendGood: true,
    },
    {
      label: "Suspended Users",
      value: "45",
      trend: "3.6% of total",
      trendGood: false,
    },
    {
      label: "Admins",
      value: "5",
      trend: "0.4% of total",
    },
  ];

  const users = [
    {
      id: 1,
      name: "Demo User",
      email: "demo@example.com",
      role: "user",
      status: "active",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">
          Users
        </h1>
        <p className="mt-1 text-sm text-[var(--color-slate)]">
          Manage user accounts, roles, and access.
        </p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div>
        <div className="bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            All Users
          </h2>
          <p className="mt-1 text-sm text-[var(--color-slate)]">
            View and manage registered users.
          </p>
        </div>

        <UserManagementTable users={users} />
      </div>
    </div>
  );
}