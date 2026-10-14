import { useState } from "react";
import { Search, LogOut } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import useCurrentUser from "../hooks/useCurrentUser";
import useSustainabilityScore from "../hooks/useSustainabilityScore";

const getStoredRole = () => {
  try {
    return JSON.parse(localStorage.getItem("user"))?.role || "user";
  } catch {
    return "user";
  }
};

function EcoScoreChip() {
  const ecoScore = useSustainabilityScore();

  return (
    <span className="text-xs bg-[var(--color-eco)]/10 text-[var(--color-eco)] px-3 py-1 rounded-full font-medium">
      Eco Score: {ecoScore ?? "—"}
    </span>
  );
}

export default function Topbar({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { name, loading } = useCurrentUser();
  const isAdmin = getStoredRole() === "admin";

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });
  const [query, setQuery] = useState("");

  const isOnSearchPage = location.pathname === "/search";

  const handleLogout = () => {
    const confirmed = window.confirm("Are you sure you want to logout?");
    if (confirmed) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login", { replace: true });
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    setQuery("");
  };

  return (
    <header className="flex items-center justify-between px-8 py-3 border-b border-[var(--color-slate)]-100 bg-[var(--color-surface)]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">
            Welcome Back{loading ? "" : name ? `, ${name}` : ""}
          </h1>
          <p className="text-sm text-[var(--color-slate)] mt-1">
            {isAdmin
              ? `Today is ${today} - Admin panel`
              : `Today is ${today} - Let's hit your green targets today!`}
          </p>
        </div>
      </div>

      <div>{children}</div>

      {!isAdmin && (
        <div className="flex items-center gap-4">
          <div className="relative w-64">
            {!isOnSearchPage && (
              <form onSubmit={handleSearchSubmit}>
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate)]"
                />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search anything..."
                  className="pl-9 pr-4 py-2 rounded-lg border border-[var(--color-slate)] text-sm outline-none w-64"
                />
              </form>
            )}
          </div>
          <EcoScoreChip />
        </div>
      )}

      <div className="flex items-center gap-7">
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 rounded-lg border border-red-400 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-900 cursor-pointer"
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
}
