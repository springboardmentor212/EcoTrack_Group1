import { Bell, LogOut } from "lucide-react";

function TopBar() {
  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-xl font-bold text-slate-900">
          AI Recommendations
        </h1>

        <p className="text-sm text-slate-500">
          Personalized eco tips based on your emissions
        </p>
      </div>

      <div className="flex items-center gap-5">
        <div className="text-right">
          <p className="text-xs text-slate-500">Eco Score</p>
          <p className="text-lg font-bold text-emerald-500">78</p>
        </div>

        <button
          type="button"
          className="relative rounded-lg p-2 text-slate-600 hover:bg-slate-100"
          aria-label="Notifications"
        >
          <Bell size={20} />

          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-100"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </header>
  );
}

export default TopBar;