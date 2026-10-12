
import { useState } from "react";
import {
  Search,
  LogOut,
  ChevronDown,
  UserRound,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";
import NotificationBell from "./NotificationBell";

export default function Topbar({ ecoScore, children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, role, loading } = useCurrentUser();

  const [query, setQuery] = useState("");
  const [profileOpen, setProfileOpen] = useState(false);

  const isOnSearchPage = location.pathname === "/search";
  const isAdmin = role === "admin";

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to logout?"
    );

    if (confirmed) {
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();

    if (!query.trim()) return;

    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  const handleSwitchToUserView = () => {
    setProfileOpen(false);

    // Navigate to the normal dashboard route.
    // This does not remove the admin role or admin permissions.
    navigate("/dashboard");
  };

  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-[var(--color-surface)] px-8 py-3">
      {/* Welcome Section */}
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">
          {loading
            ? "Welcome Back"
            : isAdmin
              ? "Admin Dashboard"
              : `Welcome Back${name ? `, ${name}` : ""}`}
        </h1>

        <p className="mt-1 text-sm text-[var(--color-slate)]">
          {isAdmin
            ? "Manage sustainability activities and platform reports."
            : "Let's hit your green targets today!"}
        </p>

        {!loading && (
          <p className="mt-1 text-xs text-[var(--color-slate)]">
            Role: {isAdmin ? "Administrator" : "User"}
          </p>
        )}
      </div>

      {/* Page-specific Content */}
      <div>{children}</div>

      {/* Search and Eco Score */}
      <div className="flex flex-wrap items-center gap-4">
        {!isOnSearchPage && (
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-64"
          >
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate)]"
            />

            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search anything..."
              aria-label="Search"
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm outline-none focus:border-[var(--color-eco)]"
            />
          </form>
        )}

        <span className="whitespace-nowrap rounded-full bg-[var(--color-eco)]/10 px-3 py-1 text-xs font-medium text-[var(--color-eco)]">
          Eco Score: {ecoScore ?? 0}
        </span>
      </div>

      {/* Notifications and Profile Menu */}
      <div className="flex items-center gap-4">
        <NotificationBell />

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((previous) => !previous)}
            aria-expanded={profileOpen}
            aria-haspopup="menu"
            className="flex items-center gap-2 rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            <UserRound size={16} />

            <span>
              {loading
                ? "Profile"
                : isAdmin
                  ? "Administrator"
                  : name || "Profile"}
            </span>

            <ChevronDown size={16} />
          </button>

          {profileOpen && (
            <div
              role="menu"
              className="absolute right-0 z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white p-2 shadow-lg"
            >
              {isAdmin && (
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleSwitchToUserView}
                  className="block w-full rounded-md px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                >
                  Switch to user view
                </button>
              )}

              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
