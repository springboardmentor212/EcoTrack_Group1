const FILTERS = ["All", "Active", "Completed"];

const ChallengeFilter = ({ selectedFilter, onFilterChange }) => {
return ( <div className="mt-6 flex flex-wrap gap-3">
{FILTERS.map((filter) => (
<button
key={filter}
type="button"
onClick={() => onFilterChange(filter)}
aria-pressed={selectedFilter === filter}
className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                        selectedFilter === filter
                            ? "bg-[var(--color-eco)] text-white"
                            : "border border-gray-200 bg-white text-[var(--color-slate)] hover:bg-gray-50"
                    }`}
>
{filter} </button>
))} </div>
);
};

export default ChallengeFilter;
