import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search } from "lucide-react";
import * as searchService from "../services/searchService";

const filterTypes = [
  { label: "All Types", value: "All Types" },
  { label: "Goals", value: "Goals" },
  { label: "Entries", value: "Entries" },
  { label: "Challenges", value: "Challenges" },
];
const sectors = ["Transportation", "Energy", "Food & Diet", "Waste", "Water"];

const typeBadgeColor = "text-[var(--color-eco)] bg-[var(--color-eco)]/10";

export default function SearchResults() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [selectedTypes, setSelectedTypes] = useState(["All Types"]);
  const [selectedSectors, setSelectedSectors] = useState([]);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleType = (t) => {
    if (t === "All Types") {
      setSelectedTypes(["All Types"]);
      return;
    }
    setSelectedTypes((prev) => {
      const withoutAll = prev.filter((p) => p !== "All Types");
      if (withoutAll.includes(t)) {
        const next = withoutAll.filter((p) => p !== t);
        return next.length ? next : ["All Types"];
      }
      return [...withoutAll, t];
    });
  };

  const toggleSector = (s) => {
    setSelectedSectors((prev) =>
      prev.includes(s) ? prev.filter((p) => p !== s) : [...prev, s],
    );
  };

  const runSearch = async (e, overrideQuery) => {
    if (e) e.preventDefault();
    const q = overrideQuery !== undefined ? overrideQuery : query;
    setLoading(true);
    setHasSearched(true);
    try {
      const typesParam = selectedTypes.includes("All Types")
        ? ""
        : selectedTypes.join(",");
      const res = await searchService.search({
        q,
        types: typesParam,
        sectors: selectedSectors.join(","),
      });
      setResults(res.data.results || []);
    } catch (err) {
      console.error("Search failed", err);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const initialQuery = searchParams.get("q");
    if (initialQuery) {
      runSearch(null, initialQuery);
    }
  }, []);

  useEffect(() => {
    if (hasSearched) runSearch();
  }, [selectedTypes, selectedSectors]);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
        Explore Platform
      </h1>

      <form onSubmit={runSearch} className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate)]"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Office commute alternative paths"
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-[var(--color-slate)] text-sm outline-none"
          />
        </div>
        <button
          type="submit"
          className="flex items-center gap-2 text-sm antialiased bg-[var(--color-eco)] text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:shadow-md hover:brightness-95 active:scale-[0.90]"
        >
          <Search size={14} /> Search
        </button>
      </form>

      <div className="grid grid-cols-4 gap-10 mt-8">
        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm h-fit">
          <h2 className="font-bold text-[var(--color-primary)] mb-3">
            Filter Results
          </h2>
          <p className="text-xs font-semibold text-[var(--color-slate)] mb-2">
            Type
          </p>
          <ul className="space-y-1 mb-8 text-sm text-[var(--color-muted)]">
            {filterTypes.map((t) => (
              <li
                key={t.value}
                className={`mb-2 ${t.disabled ? "" : "cursor-pointer hover:text-[var(--color-eco)]"}`}
              >
                <label
                  className={`flex items-center justify-between ${t.disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                >
                  <span className="flex items-center">
                    <input
                      type="checkbox"
                      disabled={t.disabled}
                      checked={selectedTypes.includes(t.value)}
                      onChange={() => toggleType(t.value)}
                      className="mr-2 accent-[var(--color-eco)]"
                    />
                    {t.label}
                  </span>
                  {t.disabled && (
                    <span className="text-[9px] uppercase tracking-wide bg-[var(--color-background)] px-1.5 py-0.5 rounded">
                      Coming soon
                    </span>
                  )}
                </label>
              </li>
            ))}
          </ul>
          <p className="text-xs font-semibold text-[var(--color-slate)] mb-2">
            Sectors
          </p>
          <ul className="space-y-1 text-sm text-[var(--color-muted)]">
            {sectors.map((s) => (
              <li
                key={s}
                className="cursor-pointer hover:text-[var(--color-eco)]"
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSectors.includes(s)}
                    onChange={() => toggleSector(s)}
                    className="mr-2 accent-[var(--color-eco)]"
                  />
                  {s}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-3">
          <p className="text-xs text-[var(--color-slate)] mb-6">
            {!hasSearched
              ? "Search or apply a filter to see results"
              : loading
                ? "Searching..."
                : `${results.length} search result${results.length !== 1 ? "s" : ""}${query ? ` for "${query}"` : ""}`}
          </p>

          <div className="flex flex-col gap-4">
            {hasSearched && !loading && results.length === 0 && (
              <p className="text-sm text-[var(--color-slate)]">
                No matches — try a different term or fewer filters.
              </p>
            )}
            {results.map((r) => (
              <div
                key={`${r.type}-${r.id}`}
                className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm"
              >
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${typeBadgeColor}`}
                >
                  {r.type}
                </span>
                <h4 className="font-semibold text-[var(--color-primary)] mt-1">
                  {r.title}
                </h4>
                <p className="text-xs text-[var(--color-slate)] mt-1">
                  {r.subtitle}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
