import {
  Home,
  Lightbulb,
  Trophy,
  Bell,
  LogOut,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="flex min-h-screen w-56 flex-col bg-slate-900 px-4 py-6 text-white">
      <div className="mb-8 flex items-center gap-2 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500">
          🌱
        </div>

        <span className="text-lg font-bold">EcoTrack</span>
      </div>

      <nav className="flex flex-1 flex-col gap-2">
        <a
          href="/user-dashboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-800"
        >
          <Home size={18} />
          Dashboard
        </a>

        <a
          href="/recommendations"
          className="flex items-center gap-3 rounded-lg bg-slate-800 px-3 py-2 text-sm"
        >
          <Lightbulb size={18} />
          Recommendations
        </a>

        <a
          href="/challenges"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-800"
        >
          <Trophy size={18} />
          Challenges
        </a>

        <a
          href="/leaderboard"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-800"
        >
          <Trophy size={18} />
          Leaderboard
        </a>

        <a
          href="/notifications"
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-800"
        >
          <Bell size={18} />
          Notifications
        </a>
      </nav>

      <a
        href="/login"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-slate-800"
      >
        <LogOut size={18} />
        Logout
      </a>
    </aside>
  );
}

export default Sidebar;