import { useCallback, useEffect, useState } from "react";

const BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const sections = [
  { key: "emissions", label: "Emissions by category" },
  { key: "goals", label: "Goal results" },
  { key: "challenges", label: "Challenge participation" },
  { key: "users", label: "Per-user breakdown" },
];

const CATEGORY_STYLE = {
  energy: { label: "Energy", short: "Energy", color: "#f59e0b" },
  transportation: {
    label: "Transportation",
    short: "Transport",
    color: "#0ea5e9",
  },
  waste: { label: "Waste", short: "Waste", color: "#94a3b8" },
  food: { label: "Food", short: "Food", color: "#10b981" },
  water: { label: "Water", short: "Water", color: "#6366f1" },
};

const styleFor = (category) =>
  CATEGORY_STYLE[category] || {
    label: category,
    short: category,
    color: "#94a3b8",
  };

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

const reportFormat = (format) => (format === "pdf" ? "PDF" : "Excel");

const toInputDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};

const quickRanges = [
  {
    label: "Last 30 days",
    get: () => {
      const end = new Date();
      const start = new Date();
      start.setDate(end.getDate() - 30);
      return [toInputDate(start), toInputDate(end)];
    },
  },
  {
    label: "This month",
    get: () => {
      const end = new Date();
      const start = new Date(end.getFullYear(), end.getMonth(), 1);
      return [toInputDate(start), toInputDate(end)];
    },
  },
  {
    label: "Last 3 months",
    get: () => {
      const end = new Date();
      const start = new Date();
      start.setMonth(end.getMonth() - 3);
      return [toInputDate(start), toInputDate(end)];
    },
  },
];

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

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function EmissionPie({ rows }) {
  const total = rows.reduce((sum, r) => sum + r.totalKg, 0);

  if (!total) {
    return (
      <p className="py-10 text-sm text-slate-500">
        No emissions logged in this date range.
      </p>
    );
  }

  const sorted = [...rows].sort((a, b) => b.totalKg - a.totalKg);

  let start = 0;
  const stops = sorted
    .filter((r) => r.totalKg > 0)
    .map((r) => {
      const from = start;
      start += (r.totalKg / total) * 100;
      return `${styleFor(r.category).color} ${from}% ${start}%`;
    })
    .join(", ");

  return (
    <div className="flex flex-wrap items-center gap-6">
      <div
        role="img"
        aria-label="Emissions by category pie chart"
        className="h-[150px] w-[150px] shrink-0 rounded-full"
        style={{ background: `conic-gradient(${stops})` }}
      />
      <ul className="space-y-1.5">
        {sorted.map((r) => (
          <li
            key={r.category}
            className="flex items-center gap-2 text-sm text-slate-700"
          >
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: styleFor(r.category).color }}
            />
            {styleFor(r.category).label} {Math.round(r.share)}%
          </li>
        ))}
      </ul>
    </div>
  );
}

function GoalBars({ rows }) {
  const total = rows.reduce((sum, g) => sum + g.goals, 0);

  if (!total) {
    return (
      <p className="py-10 text-sm text-slate-500">
        No goals found in this date range.
      </p>
    );
  }

  return (
    <div>
      <ul className="space-y-3">
        {rows.map((item) => (
          <li key={item.category} className="flex items-center gap-3">
            <span className="w-20 shrink-0 text-xs text-slate-600">
              {styleFor(item.category).short}
            </span>

            {item.goals === 0 ? (
              <span className="text-xs text-slate-400">No goals</span>
            ) : (
              <>
                <div
                  className="flex h-3.5 flex-1 overflow-hidden rounded-full bg-slate-100"
                  title={`${item.withinCap} within cap, ${item.exceeded} exceeded`}
                >
                  <div
                    className="bg-emerald-500"
                    style={{ width: `${(item.withinCap / item.goals) * 100}%` }}
                  />
                  <div
                    className="bg-red-500"
                    style={{ width: `${(item.exceeded / item.goals) * 100}%` }}
                  />
                </div>
                <span className="w-28 shrink-0 text-right text-xs text-slate-600">
                  {item.withinCap}/{item.goals} within cap
                </span>
              </>
            )}
          </li>
        ))}
      </ul>

      <div className="mt-4 flex items-center gap-4 text-xs text-slate-700">
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
          Within cap
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
          Exceeded
        </span>
      </div>
    </div>
  );
}

export default function AdminReportsPage() {
  const [from, setFrom] = useState(() => {
    const now = new Date();
    return toInputDate(new Date(now.getFullYear(), now.getMonth(), 1));
  });
  const [to, setTo] = useState(() => toInputDate(new Date()));
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

  const [preview, setPreview] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(true);
  const [previewError, setPreviewError] = useState("");

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

  useEffect(() => {
    if (!from || !to || from > to) return undefined;

    let cancelled = false;
    setLoadingPreview(true);
    setPreviewError("");

    const params = new URLSearchParams({ from, to });

    authorizedFetch(`/reports/preview?${params.toString()}`)
      .then((response) => response.json())
      .then((result) => {
        if (cancelled) return;
        if (result.success === false) {
          throw new Error(result.message || "Could not load the preview.");
        }
        setPreview(result.data);
      })
      .catch((err) => {
        if (!cancelled) {
          setPreviewError(err.message || "Could not load the preview.");
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingPreview(false);
      });

    return () => {
      cancelled = true;
    };
  }, [from, to]);

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
        throw new Error(
          "The report was created, but its download ID was missing.",
        );
      }

      const report = result.data;

      await loadHistory();

      await downloadReport(
        report._id,
        report.fileName ||
          `ecotrack-report.${format === "pdf" ? "pdf" : "xlsx"}`,
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
        item.fileName ||
          `ecotrack-report.${item.format === "pdf" ? "pdf" : "xlsx"}`,
      );
    } catch (err) {
      setError(err.message || "Could not download the report.");
    } finally {
      setDownloadingId(null);
    }
  };

  const totalKg = preview
    ? preview.emissions.reduce((sum, r) => sum + r.totalKg, 0)
    : 0;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">
            Reports
          </h1>
          <p className="mt-1 text-sm text-[var(--color-slate)]">
            Export platform data for a date range.
          </p>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-base font-bold text-slate-900">Preview</h2>
        <p className="mb-5 text-sm text-slate-500">
          Platform totals for the selected date range
        </p>

        {previewError ? (
          <p role="alert" className="text-sm text-red-600">
            {previewError}
          </p>
        ) : loadingPreview && !preview ? (
          <p className="py-10 text-sm text-slate-500">Loading preview...</p>
        ) : preview ? (
          <div
            className={`grid grid-cols-1 gap-8 transition-opacity lg:grid-cols-2 ${
              loadingPreview ? "opacity-50" : "opacity-100"
            }`}
          >
            <div>
              <h3 className="mb-4 text-xs font-semibold text-slate-800">
                Emissions by category - {Math.round(totalKg).toLocaleString()}{" "}
                kg CO₂e total
              </h3>
              <EmissionPie rows={preview.emissions} />
            </div>

            <div>
              <h3 className="mb-4 text-xs font-semibold text-slate-800">
                Goal results by category
              </h3>
              <GoalBars rows={preview.goals} />
            </div>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <h2 className="text-base font-bold text-slate-900">Export a report</h2>
        <p className="mb-4 text-sm text-slate-500">
          Choose what to include, then download.
        </p>

        <div className="grid max-w-[581px] grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block text-xs font-medium text-slate-900">
            From
            <input
              type="date"
              value={from}
              max={to || undefined}
              onChange={(event) => setFrom(event.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>

          <label className="block text-xs font-medium text-slate-900">
            To
            <input
              type="date"
              value={to}
              min={from || undefined}
              onChange={(event) => setTo(event.target.value)}
              className="mt-1.5 h-10 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm font-normal text-slate-700 outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
            />
          </label>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          {quickRanges.map((range) => (
            <button
              key={range.label}
              type="button"
              onClick={() => {
                const [start, end] = range.get();
                setFrom(start);
                setTo(end);
              }}
              className="rounded-full bg-slate-200/70 px-3 py-1.5 text-xs text-slate-600 transition hover:bg-slate-200"
            >
              {range.label}
            </button>
          ))}
        </div>

        <fieldset className="mt-5 max-w-[581px]">
          <legend className="mb-1.5 text-xs font-medium text-slate-900">
            Format
          </legend>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { value: "pdf", label: "PDF summary (with charts)" },
              { value: "excel", label: "Excel data" },
            ].map((option) => (
              <label
                key={option.value}
                className={`flex h-[44px] cursor-pointer items-center gap-3 rounded-xl border px-4 text-sm ${
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

        <fieldset className="mt-5">
          <legend className="mb-1.5 text-xs font-medium text-slate-900">
            Include
          </legend>
          <div className="grid max-w-[581px] grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
            {sections.map((section) => (
              <label
                key={section.key}
                className="flex cursor-pointer items-center gap-2 text-sm text-slate-700"
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
          <p role="alert" className="mt-4 text-sm text-red-600">
            {error}
          </p>
        )}
        {notice && (
          <p role="status" className="mt-4 text-sm text-emerald-700">
            {notice}
          </p>
        )}

        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="rounded-lg bg-emerald-500 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-emerald-300"
          >
            {exporting ? "Generating report..." : "Export report"}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 sm:p-6">
        <div className="mb-3 flex items-center justify-between gap-3">
          <h2 className="text-base font-bold text-slate-900">Past exports</h2>
          <button
            type="button"
            onClick={loadHistory}
            disabled={loadingHistory}
            className="text-sm text-sky-700 hover:underline disabled:opacity-50"
          >
            {loadingHistory ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead className="border-b border-slate-200 text-xs text-slate-500">
              <tr>
                <th className="px-2.5 py-2.5 font-semibold">Period</th>
                <th className="px-2.5 py-2.5 font-semibold">Format</th>
                <th className="px-2.5 py-2.5 font-semibold">Created</th>
                <th className="px-2.5 py-2.5 text-right font-semibold">
                  Action
                </th>
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
                    <td className="whitespace-nowrap px-2.5 py-3.5 text-slate-700">
                      {periodLabel(item.periodFrom, item.periodTo)}
                    </td>
                    <td className="px-2.5 py-3.5">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                          item.format === "pdf"
                            ? "bg-sky-100 text-sky-700"
                            : "bg-emerald-100 text-emerald-700"
                        }`}
                      >
                        {reportFormat(item.format)}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3.5 text-slate-700">
                      {formatDate(item.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-2.5 py-3.5 text-right">
                      <button
                        type="button"
                        onClick={() => handleDownload(item)}
                        disabled={downloadingId === item._id}
                        className="font-medium text-sky-700 hover:underline disabled:opacity-50"
                      >
                        {downloadingId === item._id
                          ? "Downloading..."
                          : "Download"}
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
