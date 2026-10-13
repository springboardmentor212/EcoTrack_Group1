
export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  pageSize = 10,
  onPageChange,
}) {
  const startItem =
    totalItems === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const endItem = Math.min(currentPage * pageSize, totalItems);

  if (totalPages <= 1) {
    return (
      <div className="mt-6 text-sm text-[var(--color-slate)]">
        Showing {startItem}–{endItem} of {totalItems}
      </div>
    );
  }

  return (
    <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
      <p className="text-sm text-[var(--color-slate)]">
        Showing {startItem}–{endItem} of {totalItems}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-[var(--color-slate)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Previous
        </button>

        {Array.from({ length: totalPages }, (_, index) => {
          const page = index + 1;

          return (
            <button
              key={page}
              type="button"
              onClick={() => onPageChange(page)}
              aria-current={currentPage === page ? "page" : undefined}
              className={`h-9 w-9 rounded-lg text-sm font-medium ${
                currentPage === page
                  ? "bg-[var(--color-eco)] text-white"
                  : "border border-gray-200 bg-white text-[var(--color-slate)] hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-[var(--color-slate)] disabled:cursor-not-allowed disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
