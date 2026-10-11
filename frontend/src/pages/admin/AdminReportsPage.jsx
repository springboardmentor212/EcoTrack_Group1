import { useState } from "react";

const sampleReports = [
  {
    id: 1,
    title: "Monthly Sustainability Summary",
    type: "Sustainability",
    date: "2026-10-01",
    status: "Available",
  },
  {
    id: 2,
    title: "User Activity Report",
    type: "User Activity",
    date: "2026-10-05",
    status: "Available",
  },
  {
    id: 3,
    title: "Challenge Participation Report",
    type: "Challenges",
    date: "2026-10-10",
    status: "Pending",
  },
];

export default function AdminReportsPage() {
  const [reports] = useState(sampleReports);

  const handleExport = (report) => {
    const csv = [
      ["Report", "Type", "Date", "Status"],
      [report.title, report.type, report.date, report.status],
    ]
      .map((row) =>
        row.map((value) => `"${String(value).replace(/"/g, '""')}"`).join(",")
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${report.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.csv`;
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-slate)]">
          Manage Reports
        </h1>
        <p className="mt-2 text-[var(--color-muted)]">
          Review report summaries and export report information.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-[var(--color-muted)]">Total Reports</p>
          <p className="mt-2 text-3xl font-bold text-[var(--color-slate)]">
            {reports.length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-[var(--color-muted)]">Available</p>
          <p className="mt-2 text-3xl font-bold text-[var(--color-eco)]">
            {reports.filter((report) => report.status === "Available").length}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-[var(--color-muted)]">Pending</p>
          <p className="mt-2 text-3xl font-bold text-[var(--color-slate)]">
            {reports.filter((report) => report.status === "Pending").length}
          </p>
        </div>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-[var(--color-slate)]">
            Past Exports
          </h2>
        </div>

        <table className="w-full min-w-[650px] text-left text-sm">
          <thead className="bg-gray-50 text-[var(--color-muted)]">
            <tr>
              <th className="px-5 py-3 font-medium">Report</th>
              <th className="px-5 py-3 font-medium">Type</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {reports.map((report) => (
              <tr key={report.id}>
                <td className="px-5 py-4 font-medium text-[var(--color-slate)]">
                  {report.title}
                </td>
                <td className="px-5 py-4 text-[var(--color-muted)]">
                  {report.type}
                </td>
                <td className="px-5 py-4 text-[var(--color-muted)]">
                  {report.date}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${
                      report.status === "Available"
                        ? "bg-green-100 text-green-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <button
                    type="button"
                    onClick={() => handleExport(report)}
                    className="rounded-lg border border-[var(--color-eco)] px-3 py-2 font-medium text-[var(--color-eco)] hover:bg-[var(--color-eco)]/5"
                  >
                    Export CSV
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}