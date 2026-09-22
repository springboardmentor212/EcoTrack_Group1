export default function TipRow({ text, note }) {
  return (
    <div className="flex items-center justify-between py-2 px-3">
      <div className="bg-[var(--color-eco)]/8 px-3 w-full py-2 rounded-md flex items-center justify-between border-1 border-[var(--color-eco)]">
        <div>
          <p className="text-sm text-[var(--color-muted)]">{text}</p>
          <p className="text-xs text-[var(--color-slate)]">{note}</p>
        </div>
        <button className="text-xs font-semibold bg-[var(--color-eco)] text-white px-4 py-2 rounded-xl">
          Adopt
        </button>
      </div>
    </div>
  );
}
