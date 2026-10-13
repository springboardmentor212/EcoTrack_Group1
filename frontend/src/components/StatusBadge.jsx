export default function StatusBadge({ status }) {
  const normalizedStatus = String(status || "").toLowerCase();

  const styles = {
    active: "bg-[var(--color-eco)]/10 text-[var(--color-eco)]",
    suspended: "bg-red-50 text-red-500",
    upcoming: "bg-blue-50 text-blue-600",
    ended: "bg-gray-100 text-gray-600",
  };

  const labels = {
    active: "Active",
    suspended: "Suspended",
    upcoming: "Upcoming",
    ended: "Ended",
  };

  return (
    <span
      className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${
        styles[normalizedStatus] || "bg-gray-100 text-gray-600"
      }`}
    >
      {labels[normalizedStatus] ||
        (normalizedStatus
          ? normalizedStatus.charAt(0).toUpperCase() +
            normalizedStatus.slice(1)
          : "Unknown")}
    </span>
  );
}