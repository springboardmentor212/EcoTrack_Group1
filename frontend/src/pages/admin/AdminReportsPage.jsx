
import { useCallback, useEffect, useState } from "react";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const sections = [
  { key: "emissions", label: "Emissions by category" },
  { key: "goals", label: "Goal results" },
  { key: "challenges", label: "Challenge participation" },
  { key: "users", label: "Per-user breakdown" },
];

const formatDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? ""
    : date.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

const periodLabel = (from, to) => {
  const start = formatDate(from);
  const end = formatDate(to);
  return start === end ? start : `${start} - ${end}`;
};

const reportFormat = (format) =>
  format === "pdf" ? "PDF" : "Excel";

async function authorizedFetch(path, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Request failed (${response.status})`);
  }

  return response;
}

async function downloadReport(id, fallbackName) {
  const response = await authorizedFetch(
    `/reports/${encodeURIComponent(id)}/download`,
  );

  const blob = await response.blob();
  const disposition = response.headers.get("Content-Disposition");
  const match = disposition?.match(/filename="?([^";]+)"?/i);
  const fileName = match?.[1] || fallbackName;

  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  link.remove();

  // Delay cleanup so the browser can begin the download.
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export default function AdminReportsPage() {
  const [from, setFrom] = useState("2026-04-01");
  const [to, setTo] = useState("2026-09-30");
  const [format, setFormat] = useState("pdf");
  const [include, setInclude] = useState({
    emissions: true,
    goals: true,
    challenges: true,
    users: false,
  });

  const [exports, setExports] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [downloadingId, setDownloadingId] = useState(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadHistory = useCallback(async () => {
    setLoadingHistory(true);

    try {
      const response = await authorizedFetch("/reports/history?limit=20");
      const result = await response.json();

      if (result.success === false) {
        throw new Error(result.message || "Could not load past exports.");
      }

      setExports(result.data || []);
    } catch (err) {
      setError(err.message || "Could not load past exports.");
    } finally {
      setLoadingHistory(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleExport = async () => {
    setError("");
    setNotice("");

    if (!from || !to || from > to) {
      setError("Please choose a valid date range.");
      return;
    }

    const includes = sections
      .filter((section) => include[section.key])
      .map((section) => section.key);

    if (!includes.length) {
      setError("Please select at least one section to include.");
      return;
    }

    setExporting(true);

    try {
      const response = await authorizedFetch("/reports/export", {
        method: "POST",
        body: JSON.stringify({ from, to, format, includes }),
      });

      const result = await response.json();

      if (!result.data?._id) {
        throw new Error("The report was created, but its download ID was missing.");
      }

      const report = result.data;

      // Refresh saved history even if the subsequent download fails.
      await loadHistory();

      await downloadReport(
        report._id,
        report.fileName || `ecotrack-report.${format === "pdf" ? "pdf" : "xlsx"}`,
      );

      setNotice("Report generated and downloaded successfully.");
    } catch (err) {
      setError(err.message || "Could not export the report.");
    } finally {
      setExporting(false);
    }
  };

  const handleDownload = async (item) => {
    setError("");
    setNotice("");
    setDownloadingId(item._id);

    try {
      await downloadReport(
        item._id,
        item.fileName || `ecotrack-report.${item.format === "pdf" ? "pdf" : "xlsx"}`,
      );
    } catch (err) {
      setError(err.message || "Could not download the report.");
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="min-h-full bg-slate-50 p-5 sm:p-7">
      <header className="mb-5">
        <h1 className="text-xl font-bold text-slate-900">Reports</h1>
        <p className="text-xs text-slate-500">
          Export platform data for a date range.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-[18px]">
        <h2 className="text-sm font-bold text-slate-900">Export a report</h2>
        <p className="mb-3 text-[11px] text-slate-500">
          Choose what to include, then download.
        </p>

        <div className="grid max-w-[581px] grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="block text-xs font-medium text-slate-900">
            From
            <input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(event) => setFrom(event.target.value)}
              className="mt-1.5 h-[34px] w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-normal text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>

          <label className="block text-xs font-medium text-slate-900">
            To
            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(event) => setTo(event.target.value)}
              className="mt-1.5 h-[34px] w-full rounded-lg border border-slate-200 bg-white px-2.5 text-xs font-normal text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>
        </div>

        <fieldset className="mt-3 max-w-[581px]">
          <legend className="mb-1 text-xs font-medium text-slate-900">
            Format
          </legend>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {[
              { value: "pdf", label: "PDF summary" },
              { value: "excel", label: "Excel data" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex h-[41px] cursor-pointer items-center gap-2 rounded-xl border px-3 text-xs ${
                  format === option.value
                    ? "border-sky-500 bg-sky-100 text-slate-700"
                    : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                }`}
              >
                <input
                  type="radio"
                  name="report-format"
                  value={option.value}
                  checked={format === option.value}
                  onChange={() => setFormat(option.value)}
                  className="h-3.5 w-3.5 accent-sky-600"
                />
                {option.label}
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="mt-3">
          <legend className="mb-1 text-xs font-medium text-slate-900">
            Include
          </legend>
          <div className="space-y-1.5">
            {sections.map((section) => (
              <label
                key={section.key}
                className="flex cursor-pointer items-center gap-2 text-xs text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={include[section.key]}
                  onChange={(event) =>
                    setInclude((current) => ({
                      ...current,
                      [section.key]: event.target.checked,
                    }))
                  }
                  className="h-3.5 w-3.5 rounded accent-sky-600"
                />
                {section.label}
              </label>
            ))}
          </div>
        </fieldset>

        {error && (
          <p role="alert" className="mt-3 text-xs text-red-600">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-3 text-xs text-emerald-700">
            {notice}
          </p>
        )}

        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="rounded-lg bg-emerald-500 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            {exporting ? "Generating report..." : "Export report"}
          </button>
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-[18px]">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-sm font-bold text-slate-900">Past exports</h2>
          <button
            type="button"
            onClick={loadHistory}
            disabled={loadingHistory}
            className="text-xs text-sky-700 hover:underline disabled:opacity-50"
          >
            {loadingHistory ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="max-w-[581px] overflow-x-auto">
          <table className="w-full border-collapse text-left text-xs">
            <thead className="border-b border-slate-200 text-[10px] text-slate-500">
              <tr>
                <th className="px-2.5 py-2 font-medium">Period</th>
                <th className="px-2.5 py-2 font-medium">Format</th>
                <th className="px-2.5 py-2 font-medium">Created</th>
                <th className="px-2.5 py-2 font-medium">Download</th>
              </tr>
            </thead>
            <tbody>
              {loadingHistory ? (
                <tr>
                  <td colSpan="4" className="px-2.5 py-5 text-slate-500">
                    Loading past exports...
                  </td>
                </tr>
              ) : exports.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-2.5 py-5 text-slate-500">
                    No saved exports yet.
                  </td>
                </tr>
              ) : (
                exports.map((item) => (
                  <tr
                    key={item._id}
                    className="border-b border-slate-200 last:border-b-0"
                  >
                    <td className="whitespace-nowrap px-2.5 py-3 text-slate-700">
                      {periodLabel(item.periodFrom, item.periodTo)}
                    </td>
                    <td className="px-2.5 py-3">
                      <span
                        className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                          item.format === "pdf"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {reportFormat(item.format)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3 text-slate-700">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3">
                      <button
                        type="button"
                        onClick={() => handleDownload(item)}
                        disabled={downloadingId === item._id}
                        className="text-sky-700 hover:underline disabled:opacity-50"
                      >
                        {downloadingId === item._id ? "Downloading..." : "Download"}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
