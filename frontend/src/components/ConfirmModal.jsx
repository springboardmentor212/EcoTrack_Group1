export default function ConfirmModal({
  isOpen,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  onClose,
  isLoading = false,
  danger = false,
}) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        className="w-full max-w-md rounded-2xl bg-[var(--color-surface)] p-6 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2
              id="confirm-modal-title"
              className="text-lg font-semibold text-[var(--color-primary)]"
            >
              {title}
            </h2>

            <p
              id="confirm-modal-message"
              className="mt-2 text-sm text-[var(--color-slate)]"
            >
              {message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="text-xl leading-none text-[var(--color-slate)] hover:text-[var(--color-primary)] disabled:opacity-50"
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-[var(--color-slate)] hover:bg-gray-50 disabled:opacity-50"
          >
            {cancelText}
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`rounded-lg px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 ${
              danger ? "bg-red-600" : "bg-[var(--color-eco)]"
            }`}
          >
            {isLoading ? "Please wait..." : confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
