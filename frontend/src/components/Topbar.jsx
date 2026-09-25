import { Bell, LogOut } from "lucide-react";

function TopBar() {
  return (
    <header className="flex h-[94px] items-start justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-lg font-bold text-slate-900">
          AI Recommendations
        </h1>

        <p className="text-xs text-slate-500">
          Personalized eco tips based on your emissions
        </p>
      </div>

      <div className="flex items-center gap-4">
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-600">
          Eco Score: 88
        </div>

        <button
          type="button"
          className="text-amber-500"
          aria-label="Notifications"
        >
          <Bell size={16} fill="currentColor" />
        </button>

        <button
          type="button"
          className="flex items-center gap-2 rounded-md border border-[#0284c7] px-3 py-1.5 text-xs font-medium text-[#0284c7]"
        >
          <LogOut size={14} />
          Logout
        </button>
      </div>
    </header>
  );
}

export default TopBar;