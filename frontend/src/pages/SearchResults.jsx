import { Search } from "lucide-react";

const filterTypes = [
  "All Categories",
  "Challenges",
  "Goals",
  "Users",
  "Entries",
];
const sectors = ["Energy", "Transit", "Food & Diet", "Waste Systems"];

export default function Explore() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
        Explore Platform
      </h1>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate)]"
          />
          <input
            placeholder="Office commute alternative paths"
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-[var(--color-slate)] text-sm outline-none"
          />
        </div>
        <button className="flex items-center gap-2 text-sm antialiased bg-[var(--color-eco)] text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:shadow-md hover:brightness-95 active:scale-[0.90]">
          <Search size={14} /> Search
        </button>
      </div>

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
                key={t}
                className="cursor-pointer mb-2 hover:text-[var(--color-eco)]"
              >
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="mr-2 accent-[var(--color-eco)]"
                  />
                  {t}
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
                    className="mr-2 accent-[var(--color-eco)]"
                  />
                  {s}
                </label>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-3">
          <div>
            <div className="flex items-start justify-between">
              <p className="text-xs text-[var(--color-slate)] mb-6">
                3 search results for "commute alternative"
              </p>
              {/* <select className="text-sm">
                <option>Sort by: Relevance</option>
                <option>Sort by: Newest</option>
                <option>Sort by: Most Active</option>
              </select> */}
            </div>

            <div className="flex flex-col gap-4 mb-15">
              <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-[var(--color-eco)] bg-[var(--color-eco)]/10 px-2 py-0.5 rounded-full">
                  Challenge
                </span>
                <h4 className="font-semibold text-[var(--color-primary)] mt-1">
                  Plastic-Free November Run
                </h4>
                <p className="text-xs text-[var(--color-slate)] mt-1">
                  342 active participants · Starts Nov 1
                </p>
              </div>
              <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-[var(--color-eco)] bg-[var(--color-eco)]/10 px-2 py-0.5 rounded-full">
                  Community Member
                </span>
                <h4 className="font-semibold text-[var(--color-primary)] mt-1">
                  Marcus Aurelius (Eco Score 94)
                </h4>
                <p className="text-xs text-[var(--color-slate)] mt-1">
                  Top contributor in Transportation sector
                </p>
              </div>
              <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
                <span className="text-xs text-[var(--color-eco)] bg-[var(--color-eco)]/10 px-2 py-0.5 rounded-full">
                  Goal Template
                </span>
                <h4 className="font-semibold text-[var(--color-primary)] mt-1">
                  Targeted Commute Mitigation
                </h4>
                <p className="text-xs text-[var(--color-slate)] mt-1">
                  Highly rated by users with EV assets
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-[var(--color-primary)] mt-6 mb-3">
              Recommended Active Challenges
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-[var(--color-muted)]">
                    Carpool Champion
                  </h4>
                  <p className="text-xs text-[var(--color-slate)] mt-1">
                    Share transit commute 3x/week with coworkers · 250 pts
                  </p>
                </div>
                <button className="cursor-pointer text-xs bg-[var(--color-eco)] text-white px-3 py-1.5 rounded-full">
                  Join
                </button>
              </div>
              <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-[var(--color-muted)]">
                    Smart-Grid Adapter
                  </h4>
                  <p className="text-xs text-[var(--color-slate)] mt-1">
                    Limit kitchen appliance load during peak hours · 180 pts
                  </p>
                </div>
                <button className="cursor-pointer text-xs bg-[var(--color-eco)] text-white px-3 py-1.5 rounded-full">
                  Join
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
