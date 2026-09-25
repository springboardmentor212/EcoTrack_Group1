function Sidebar() {
  return (
    <aside className="flex min-h-screen w-[205px] flex-col bg-[#0f172a] px-4 py-4 text-white">
      <div className="mb-6 flex items-center gap-2 px-0">
        <div className="h-5 w-5 rounded-md bg-[#10b981]" />
        <span className="text-base font-bold">EcoTrack</span>
      </div>

      <nav className="flex flex-col gap-1">
        <a
          href="/recommendations"
          className="rounded-md bg-[#0284c7] px-2.5 py-2 text-xs font-medium"
        >
          Recommendations
        </a>

        <a
          href="/challenges"
          className="rounded-md px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-800"
        >
          Challenges
        </a>

        <a
          href="/challenges/detail"
          className="rounded-md px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-800"
        >
          Challenge Detail
        </a>

        <a
          href="/leaderboard"
          className="rounded-md px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-800"
        >
          Leaderboard
        </a>

        <a
          href="/notifications"
          className="rounded-md px-2.5 py-2 text-xs text-slate-300 hover:bg-slate-800"
        >
          Notifications
        </a>
      </nav>
    </aside>
  );
}

export default Sidebar;