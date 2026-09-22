export default function LeaderboardRow({ rank, name, tag, pts, highlight }) {
  return (
    <div className="flex flex-col">
      <div
        className={`flex items-center justify-between bg-[var(--color-slate)]/8 py-2 px-2 rounded-lg text-sm mb-3 ${highlight ? "bg-[var(--color-eco)]/10" : ""}`}
      >
        <span className="w-8 text-[var(--color-slate)]">{rank}</span>
        <span className="flex-1 text-[var(--color-muted)] ml-3">{name}</span>
        <span className="text-xs text-[var(--color-slate)] mr-4">{tag}</span>
        <span className="text-xs font-medium text-[var(--color-eco)]">
          {pts}
        </span>
      </div>
    </div>
  );
}
