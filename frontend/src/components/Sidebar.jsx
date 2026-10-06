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
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";

const NAV_ITEMS = [
  { to: "/user-dashboard", icon: Home, label: "Dashboard" },
  { to: "/carbon-tracker", icon: Zap, label: "Carbon Tracker" },
  { to: "/goals", icon: Target, label: "Goals" },
  { to: "/challenges", icon: Trophy, label: "Challenges" },
  { to: "/leaderboard", icon: Medal, label: "Leaderboard" },
  { to: "/search", icon: Search, label: "Search" },
  { to: "/recommendations", icon: Sparkles, label: "Recommendations" },
  { to: "/profile", icon: User, label: "Profile" },
];

export default function Sidebar() {
  const location = useLocation();
  const { name, initial, email, loading } = useCurrentUser();

  return (
    <aside className="w-64 flex-shrink-0 bg-[var(--color-primary)] flex flex-col h-screen">
      <div className="flex items-center gap-2 p-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-eco)]">
          <Flower size={18} color="#FFFFFF" />
        </div>
        <span className="text-lg font-bold text-white">EcoTrack</span>
      </div>

      <nav className="flex-1 px-4 flex flex-col gap-1">
        {NAV_ITEMS.map((item) => {
          const isActive =
            location.pathname === item.to ||
            location.pathname.startsWith(item.to + "/");
          return (
            <Link
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm ${
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

      <div className="p-4 flex items-center gap-3 border-t border-white/10">
        <div className="h-9 w-9 rounded-full bg-[var(--color-eco)] flex items-center justify-center text-white font-semibold text-sm">
          {loading ? "…" : initial}
        </div>
        <div>
          <p className="text-sm font-medium text-white">
            {loading ? "Loading..." : name || "User"}
          </p>
          <p className="text-xs text-white/60 truncate max-w-[140px]">
            {loading ? "" : email}
          </p>
        </div>
      </div>
    </aside>
  );
}
