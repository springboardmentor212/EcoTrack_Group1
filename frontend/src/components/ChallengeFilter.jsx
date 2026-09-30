

const ChallengeFilter = ({ selectedFilter, onFilterChange }) => {
    return (
        <div className="mt-6 flex flex-wrap gap-3">

            <button
                onClick={() => onFilterChange("All")}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    selectedFilter === "All"
                        ? "bg-[var(--color-eco)] text-white"
                        : "bg-white border border-gray-200 text-[var(--color-slate)]"
                }`}
            >
                All
            </button>

            <button
                onClick={() => onFilterChange("Active")}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    selectedFilter === "Active"
                        ? "bg-[var(--color-eco)] text-white"
                        : "bg-white border border-gray-200 text-[var(--color-slate)]"
                }`}
            >
                Active
            </button>

            <button
                onClick={() => onFilterChange("Completed")}
                className={`rounded-lg px-4 py-2 text-sm font-medium ${
                    selectedFilter === "Completed"
                        ? "bg-[var(--color-eco)] text-white"
                        : "bg-white border border-gray-200 text-[var(--color-slate)]"
                }`}
            >
                Completed
            </button>

        </div>
    );
};

export default ChallengeFilter;