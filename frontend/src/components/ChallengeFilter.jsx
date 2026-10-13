const FILTERS = ["All", "Active", "Upcoming", "Completed"];

const ChallengeFilter = ({ selectedFilter, onFilterChange }) => {
  return (
    <div className="mt-6 flex flex-wrap gap-3">
      {FILTERS.map((filter) => (
        <button
          key={filter}
          onClick={() => onFilterChange(filter)}
          className={`rounded-lg px-4 py-2 text-sm font-medium ${
            selectedFilter === filter
              ? "bg-[var(--color-eco)] text-white"
              : "bg-white border border-gray-200 text-[var(--color-slate)]"
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
};

export default ChallengeFilter;
