
import {
  Flower,
  Home,
  Zap,
  Target,
  Trophy,
  Medal,
  FileText,
  Search,
  Sparkles,
  User,
  Users,
} from "lucide-react";

import { Link, useLocation } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";

const USER_NAV_ITEMS = [
  { to: "/user-dashboard", icon: Home, label: "Dashboard" },
  { to: "/carbon-tracker", icon: Zap, label: "Carbon Tracker" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/challenges", icon: Trophy, label: "Challenges" },
  { to: "/leaderboard", icon: Medal, label: "Leaderboard" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/reports", icon: FileText, label: "Reports" },
  { to: "/recommendations", icon: Sparkles, label: "Recommendations" },
  { to: "/profile", icon: User, label: "Profile" },
];

const ADMIN_NAV_ITEMS = [
  { to: "/admin-dashboard", icon: Home, label: "Dashboard" },
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/challenges", icon: Trophy, label: "Challenges" },
  { to: "/admin/reports", icon: FileText, label: "Reports" },
];

export default function Sidebar() {
  const location = useLocation();
  const currentUser = useCurrentUser() || {};

  const name = currentUser.name;
  const initial = currentUser.initial;
  const email = currentUser.email;
  const loading = currentUser.loading;

  const role = String(
    currentUser.role || currentUser.user?.role || ""
  ).toLowerCase();

  const isAdmin =
    role === "admin" || role === "administrator";

  const navItems = isAdmin
    ? ADMIN_NAV_ITEMS
    : USER_NAV_ITEMS;

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-[var(--color-primary)]">

      {/* Logo */}
      <div className="flex items-center gap-2 p-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-eco)]">
          <Flower size={18} color="#FFFFFF" />
        </div>

        <span className="text-lg font-bold text-white">
          EcoTrack
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-4">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            location.pathname.startsWith(item.to + "/");

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                isActive
                  ? "bg-[var(--color-secondary)] font-medium text-white"
                  : "text-white/70 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="flex items-center gap-3 border-t border-white/10 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-eco)] text-sm font-semibold text-white">
          {loading
            ? "..."
            : initial ||
              (name ? name.charAt(0).toUpperCase() : "U")}
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-white">
            {loading ? "Loading..." : name || "User"}
          </p>

          <p className="max-w-[140px] truncate text-xs text-white/60">
            {loading ? "" : email || ""}
          </p>

          {!loading && (
            <p className="mt-1 text-xs text-white/50">
              {isAdmin ? "Administrator" : "User"}
            </p>
          )}
        </div>
      </div>

    </aside>
  );
}
