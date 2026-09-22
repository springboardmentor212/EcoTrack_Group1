import { Search, Bell, LogOut } from "lucide-react";
import defaultAvatar from "../assets/avatar.png"
import { useNavigate } from "react-router-dom";

export default function Topbar({ ecoScore, children, profilePic }) {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <header className="flex items-center justify-between px-8 py-3 border-b border-[var(--color-slate)]-100 bg-[var(--color-surface)]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">
            Welcome Back, Trapti
          </h1>
          <p className="text-sm text-[var(--color-slate)] mt-1">
            Today is Thursday, Oct 24 - Let's hit your green targets today!
          </p>
        </div>
      </div>
      <div>{children}</div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate)]"
          />
          <input
            placeholder="Search anything..."
            className="pl-9 pr-4 py-2 rounded-lg border border-[var(--color-slate)] text-sm outline-none w-64"
          />
        </div>
        <span className="text-xs bg-[var(--color-eco)]/10 text-[var(--collor-eco)] px-3 py-1 rounded-full font-medium">
          Eco Score: {ecoScore}
        </span>
      </div>
      <div className="flex items-center gap-7">
        <Bell size={20} className="text-[var(--color-slate)]" />
        <button onClick={handleLogout}
        className="flex items-center gap-2 rounded-lg border border-red-400 px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-red-50 hover:text-red-900 cursor-pointer">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </header>
  );
}
