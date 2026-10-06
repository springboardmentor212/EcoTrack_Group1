import { useMemo, useState } from "react";
import StatCard from "../components/StatCard";
import UserFilters from "../components/UserFilters";
import UserManagementTable from "../components/UserManagementTable";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");

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

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(search.toLowerCase()) ||
        user.email.toLowerCase().includes(search.toLowerCase());

      const matchesRole = role === "all" || user.role === role;
      const matchesStatus = status === "all" || user.status === status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [search, role, status]);

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
        <div className="rounded-2xl bg-[var(--color-surface)] p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-[var(--color-primary)]">
            All Users
          </h2>

          <p className="mt-1 text-sm text-[var(--color-slate)]">
            View and manage registered users.
          </p>

          <UserFilters
            search={search}
            role={role}
            status={status}
            onSearchChange={setSearch}
            onRoleChange={setRole}
            onStatusChange={setStatus}
          />

          <UserManagementTable users={filteredUsers} />
        </div>
      </div>
    </div>
  );
}