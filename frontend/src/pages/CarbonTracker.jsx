import { useNavigate } from "react-router-dom";
import { Search, Download, Plus, Info } from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import LogEntryModal from "../components/LogEntryModal";
import EmissionBreakdownModal from "../components/EmissionBreakdownModal";
import {
  getCarbonEntries,
  searchCarbonEntries,
} from "../services/carbonService";

const LIMIT = 10;

function rangeToDates(rangeLabel) {
  const to = new Date();
  const from = new Date();
  if (rangeLabel === "Last 7 Days") from.setDate(to.getDate() - 7);
  else if (rangeLabel === "This Year") {
    from.setMonth(0);
    from.setDate(1);
  } else from.setDate(to.getDate() - 30);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

export default function CarbonTracker() {
  const [isLogEntryModalOpen, setIsLogEntryModalOpen] = useState(false);
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);
  const [selectedLogForBreakdown, setSelectedLogForBreakdown] = useState(null);

  const [searchInput, setSearchInput] = useState("");
  const [category, setCategory] = useState("All");
  const [dateRange, setDateRange] = useState("Last 30 Days");

  const navigate = useNavigate();

  const isFiltering = searchInput.trim() !== "" || category !== "All";

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      if (isFiltering) {
        const { from, to } = rangeToDates(dateRange);
        const res = await searchCarbonEntries({
          q: searchInput.trim() || undefined,
          category: category !== "All" ? category : undefined,
          from,
          to,
        });
        let carbonEntries = res?.data?.carbonEntries || [];
        carbonEntries.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          if (dateA.getTime() !== dateB.getTime()) {
            return dateB - dateA;
          }

          return (
            new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id)
          );
        });
        setEntries(carbonEntries);
        setTotalEntries(carbonEntries.length);
        setTotalPages(1);
      } else {
        const res = await getCarbonEntries(page, LIMIT);
        let carbonEntries = res?.data?.carbonEntries || [];
        carbonEntries.sort((a, b) => {
          const dateA = new Date(a.date);
          const dateB = new Date(b.date);

          if (dateA.getTime() !== dateB.getTime()) {
            return dateB - dateA;
          }

          return (
            new Date(b.createdAt || b._id) - new Date(a.createdAt || a._id)
          );
        });
        setEntries(carbonEntries);
        setTotalPages(res?.data?.totalPages || 1);
        setTotalEntries(res?.data?.totalEntries || 0);
      }
    } catch (err) {
      setEntries([]);
      setError(err.response?.data?.message || "Couldn't load your logs.");
    } finally {
      setLoading(false);
    }
  }, [page, isFiltering, searchInput, category, dateRange]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleEntryAdded = () => {
    setPage(1);
    fetchEntries();
  };

  const handleExportCSV = () => {
    if (!entries || entries.length === 0) {
      alert("No data available to export.");
      return;
    }

    const headers = ["Date", "Category", "Description", "Carbon Amount (kg)"];
    const rows = entries.map((log) => [
      `"${new Date(log.date).toLocaleDateString()}"`,
      `"${log.category || ""}"`,
      `"${(log.description || "").replace(/"/g, '""')}"`,
      log.calculatedCO2 || 0,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `carbon_logs_${new Date().toISOString().slice(0, 10)}.csv`,
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">
          Carbon Log History
        </h1>
        <button
          onClick={() => setIsLogEntryModalOpen(true)}
          className="group flex items-center gap-2 text-sm antialiased bg-[var(--color-eco)] text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:shadow-md hover:brightness-95 active:scale-[0.90]"
        >
          <Plus
            size={20}
            className="transition-transform duration-300 ease-in-out group-hover:rotate-90"
          />{" "}
          Log New Entry
        </button>
      </div>

      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate)]"
            />
            <input
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setPage(1);
              }}
              placeholder="Search your sustainability logs..."
              className="pl-9 pr-4 py-2 w-full rounded-lg border border-[var(--color-slate)] text-sm outline-none"
            />
          </div>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
            className="text-sm border border-[var(--color-slate)] rounded-lg px-3 py-2"
          >
            <option value="All">Category: All</option>
            <option>Transportation</option>
            <option>Energy</option>
            <option>Food</option>
            <option>Waste</option>
            <option>Water</option>
          </select>
          <div className="flex items-center gap-3">
            <select
              value={dateRange}
              onChange={(e) => {
                setDateRange(e.target.value);
                setPage(1);
              }}
              className="text-sm border border-[var(--color-slate)] rounded-lg px-3 py-2"
            >
              <option>Last 30 Days</option>
              <option>Last 7 Days</option>
              <option>This Year</option>
            </select>
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-2 text-sm antialiased bg-[var(--color-eco)] text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:shadow-md hover:brightness-95 active:scale-[0.90]"
            >
              <Download size={14} /> Export CSV
            </button>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[var(--color-slate)] border-b border-[var(--color-slate)]/20">
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Activity Description</th>
                <th className="px-5 py-3">Carbon Amount</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-[var(--color-slate)]"
                  >
                    Loading...
                  </td>
                </tr>
              )}
              {!loading && error && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-red-600"
                  >
                    {error}
                  </td>
                </tr>
              )}
              {!loading && !error && (entries?.length || 0) === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-6 text-center text-[var(--color-slate)]"
                  >
                    No entries yet — log your first activity.
                  </td>
                </tr>
              )}
              {!loading &&
                !error &&
                entries.map((log) => (
                  <tr
                    key={log._id}
                    onClick={() => navigate(`/carbon-tracker/${log._id}`)}
                    className="border-b border-[var(--color-slate)] last:border-0 cursor-pointer hover:bg-[var(--color-background)]"
                  >
                    <td className="px-5 py-3 text-[var(--color-muted)]">
                      {new Date(log.date).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-[var(--color-muted)]">
                      {log.category}
                    </td>
                    <td className="px-5 py-3 text-[var(--color-slate)]">
                      {log.description || "—"}
                    </td>
                    <td className="px-5 py-3 font-medium text-[var(--color-primary)]">
                      {log.calculatedCO2} kg CO₂
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedLogForBreakdown(log);
                        }}
                        className="flex items-center gap-1 text-xs text-teal-600 hover:underline"
                      >
                        <Info size={14} /> View Breakdown
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        {!isFiltering && (
          <div className="flex items-center justify-between mt-4 text-sm text-[var(--color-slate)]">
            <span>
              Showing {entries.length === 0 ? 0 : (page - 1) * LIMIT + 1}-
              {(page - 1) * LIMIT + entries.length} of {totalEntries} entries
            </span>
            <div className="flex gap-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1 border border-[var(--color-slate)] bg-[var(--color-slate)]/10 font-semibold cursor-pointer rounded-lg antialiased transition-all duration-300 transform hover:shadow-md hover:brightness-95 active:scale-[0.90] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="px-3 py-1 border border-[var(--color-slate)] text-sm antialiased bg-[var(--color-eco)] text-white font-semibold cursor-pointer rounded-lg transition-all duration-300 transform hover:shadow-md hover:brightness-95 active:scale-[0.90] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <LogEntryModal
        isOpen={isLogEntryModalOpen}
        onClose={() => setIsLogEntryModalOpen(false)}
        onSuccess={handleEntryAdded}
      />

      {selectedLogForBreakdown && (
        <EmissionBreakdownModal
          entry={selectedLogForBreakdown}
          onClose={() => setSelectedLogForBreakdown(null)}
        />
      )}
    </div>
  );
}
