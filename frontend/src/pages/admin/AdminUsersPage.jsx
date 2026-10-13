import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import StatCard from "../../components/StatCard";
import UserFilters from "../../components/admin/UserFilters";
import UserManagementTable from "../../components/admin/UserManagementTable";
import Pagination from "../../components/Pagination";
import ConfirmModal from "../../components/ConfirmModal";
import UserDetailModal from "../../components/admin/UserDetailModal";

import {
  getUserStats,
  getUsers,
  getUserDetail,
  updateUserRole,
  updateUserStatus,
} from "../../services/adminService";

const PAGE_SIZE = 10;

const getCurrentUserId = () => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.id || null;
  } catch {
    return null;
  }
};

export default function AdminUsers() {
  const currentUserId = getCurrentUserId();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [role, setRole] = useState("all");
  const [status, setStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);

  const loadStats = useCallback(async () => {
    try {
      const response = await getUserStats();
      setStats(response.data.data);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not load user statistics.",
      );
    }
  }, []);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const params = {
        page: currentPage,
        limit: PAGE_SIZE,
      };

      if (debouncedSearch.trim()) {
        params.search = debouncedSearch.trim();
      }

      if (role !== "all") params.role = role;
      if (status !== "all") params.status = status;

      const response = await getUsers(params);
      const data = response.data.data;

      setUsers(
        data.users.map((user) => ({
          ...user,
          id: user._id,
          status: user.status || "active",
        })),
      );

      setTotalPages(Math.max(data.totalPages || 1, 1));
      setTotalUsers(data.total ?? 0);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load users. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [currentPage, debouncedSearch, role, status]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const statCards = useMemo(() => {
    if (!stats) {
      return [
        { label: "Total Users", value: "—", trend: "Loading statistics" },
        { label: "Active Users", value: "—", trend: "Active this month" },
        { label: "Suspended Users", value: "—", trend: "Currently suspended" },
        { label: "Admins", value: "—", trend: "Administrators" },
      ];
    }

    return [
      {
        label: "Total Users",
        value: stats.totalUsers?.value ?? 0,
        trend: `${stats.totalUsers?.changeThisMonth ?? 0} new this month`,
      },
      {
        label: "Active Users",
        value: stats.activeThisMonth?.value ?? 0,
        trend: `${stats.activeThisMonth?.percentOfUsers ?? 0}% of total users active this month`,
        trendGood: true,
      },
      {
        label: "Suspended Users",
        value: stats.suspended?.value ?? 0,
        trend: `${stats.suspended?.changeThisMonth ?? 0} suspended this month`,
        trendGood: false,
      },
      {
        label: "Admins",
        value: stats.administrators?.value ?? 0,
        trend: `${stats.administrators?.changeThisMonth ?? 0} role changes this month`,
      },
    ];
  }, [stats]);

  const handleView = async (user) => {
    try {
      const response = await getUserDetail(user.id);
      const detail = response.data.data;

      setSelectedUser({
        ...user,
        ...detail,
        id: detail._id || detail.id || user.id,
        status: detail.status || user.status || "active",
      });
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not load user details.",
      );
    }
  };

  const handleRoleChange = (user, nextRole) => {
    if (user.role === nextRole) return;

    setPendingAction({ type: "role", user, value: nextRole });
  };

  const handleToggleStatus = (user) => {
    const nextStatus = user.status === "active" ? "suspended" : "active";

    setPendingAction({ type: "status", user, value: nextStatus });
  };

  const handleConfirmAction = async () => {
    if (!pendingAction) return;

    const { type, user, value } = pendingAction;
    setActionLoading(true);

    try {
      const response =
        type === "role"
          ? await updateUserRole(user.id, value)
          : await updateUserStatus(user.id, value);

      toast.success(response.data.message || "User updated successfully.");
      setPendingAction(null);

      await Promise.all([loadStats(), loadUsers()]);

      if (selectedUser?.id === user.id) {
        setSelectedUser((previous) => ({
          ...previous,
          ...(type === "role" ? { role: value } : { status: value }),
        }));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not update this user.");

      await Promise.all([loadStats(), loadUsers()]);
    } finally {
      setActionLoading(false);
    }
  };

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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => (
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
            onSearchChange={(value) => {
              setSearch(value);
              setCurrentPage(1);
            }}
            onRoleChange={(value) => {
              setRole(value);
              setCurrentPage(1);
            }}
            onStatusChange={(value) => {
              setStatus(value);
              setCurrentPage(1);
            }}
          />

          {error && (
            <div className="mt-5 rounded-lg bg-red-50 p-4 text-sm text-red-600">
              {error}
              <button
                type="button"
                onClick={() => {
                  loadStats();
                  loadUsers();
                }}
                className="ml-2 font-semibold underline"
              >
                Retry
              </button>
            </div>
          )}

          {loading ? (
            <p className="py-10 text-center text-sm text-[var(--color-slate)]">
              Loading users...
            </p>
          ) : (
            <>
              <UserManagementTable
                users={users}
                currentUserId={currentUserId}
                onView={handleView}
                onRoleChange={handleRoleChange}
                onToggleStatus={handleToggleStatus}
              />

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalUsers}
                pageSize={PAGE_SIZE}
                onPageChange={setCurrentPage}
              />
            </>
          )}
        </div>
      </div>

      <UserDetailModal
        isOpen={Boolean(selectedUser)}
        user={selectedUser}
        onClose={() => setSelectedUser(null)}
      />

      <ConfirmModal
        isOpen={Boolean(pendingAction)}
        title={
          pendingAction?.type === "role"
            ? "Confirm Role Change"
            : pendingAction?.value === "suspended"
              ? "Suspend User"
              : "Reactivate User"
        }
        message={
          pendingAction?.type === "role"
            ? `Change ${pendingAction.user.name}'s role to ${pendingAction.value}?`
            : pendingAction?.value === "suspended"
              ? `Suspend ${pendingAction?.user.name}'s account?`
              : `Reactivate ${pendingAction?.user.name}'s account?`
        }
        confirmText={
          pendingAction?.type === "role"
            ? "Change Role"
            : pendingAction?.value === "suspended"
              ? "Suspend"
              : "Reactivate"
        }
        onConfirm={handleConfirmAction}
        isLoading={actionLoading}
        onClose={() => {
          if (!actionLoading) setPendingAction(null);
        }}
      />
    </div>
  );
}
