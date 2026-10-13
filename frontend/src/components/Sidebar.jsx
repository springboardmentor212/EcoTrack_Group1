import {
  Flower,
  Home,
  Zap,
  Target,
  Trophy,
  Medal,
  Search,
  Sparkles,
  User,
  Users,
  FileText,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";

const USER_NAV = [
  { to: "/user-dashboard", icon: Home, label: "Dashboard" },
  { to: "/carbon-tracker", icon: Zap, label: "Carbon Tracker" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/challenges", icon: Trophy, label: "Challenges" },
  { to: "/leaderboard", icon: Medal, label: "Leaderboard" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/recommendations", icon: Sparkles, label: "Recommendations" },
  { to: "/profile", icon: User, label: "Profile" },
];

const ADMIN_NAV = [
  { to: "/admin/users", icon: Users, label: "Users" },
  { to: "/admin/challenges", icon: Trophy, label: "Challenges" },
  { to: "/admin/reports", icon: FileText, label: "Reports" },
];

const getStoredRole = () => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.role || "user";
  } catch {
    return "user";
  }
};

export default function Sidebar() {
  const location = useLocation();
  const { name, initial, email, loading } = useCurrentUser();
  const isAdmin = getStoredRole() === "admin";
  const navItems = isAdmin ? ADMIN_NAV : USER_NAV;

  return (
    <aside className="flex h-screen w-64 flex-shrink-0 flex-col bg-[var(--color-primary)]">
      <div className="flex items-center gap-2 p-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-eco)]">
          <Flower size={18} color="#FFFFFF" />
        </div>

        <span className="text-lg font-bold text-white">EcoTrack</span>
      </div>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto px-4">
        {navItems.map((item) => {
          const isActive =
            location.pathname === item.to ||
            location.pathname.startsWith(item.to + "/");

          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm ${
                isActive
                  ? "bg-[var(--color-secondary)] font-medium"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="flex items-center gap-3 border-t border-white/10 p-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-eco)] text-sm font-semibold text-white">
          {loading ? "…" : initial}
        </div>

        <div>
          <p className="text-sm font-medium text-white">
            {loading ? "Loading..." : name || "User"}
          </p>
          <p className="max-w-[140px] truncate text-xs text-white/60">
            {loading ? "" : email}
          </p>
        </div>
      </div>
    </aside>
  );
}
