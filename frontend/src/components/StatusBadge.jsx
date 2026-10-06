export default function StatusBadge({ status }) {
  const isActive = status === "active";

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
        isActive
          ? "bg-[var(--color-eco)]/10 text-[var(--color-eco)]"
          : "bg-red-50 text-red-500"
      }`}
    >
      {isActive ? "Active" : "Suspended"}
    </span>
  );
}