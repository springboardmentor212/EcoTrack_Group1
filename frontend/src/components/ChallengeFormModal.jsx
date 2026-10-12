
import { useState } from "react";

const getInitialValues = (challenge) => ({
  title: challenge?.title || "",
  description: challenge?.description || "",
  duration: challenge?.duration || "",
  status: challenge?.status || "Active",
  startDate: challenge?.startDate
    ? String(challenge.startDate).slice(0, 10)
    : "",
  endDate: challenge?.endDate
    ? String(challenge.endDate).slice(0, 10)
    : "",
});

function ChallengeForm({
  onClose,
  onSave,
  editingChallenge,
}) {
  const [form, setForm] = useState(() =>
    getInitialValues(editingChallenge)
  );
  const [error, setError] = useState("");

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const {
      title,
      description,
      duration,
      status,
      startDate,
      endDate,
    } = form;

    if (
      !title.trim() ||
      !description.trim() ||
      !duration.trim() ||
      !startDate ||
      !endDate
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (endDate < startDate) {
      setError("End date must be on or after the start date.");
      return;
    }

    onSave({
      ...editingChallenge,
      title: title.trim(),
      description: description.trim(),
      duration: duration.trim(),
      status,
      startDate,
      endDate,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="challenge-form-title"
      >
        <div className="flex items-center justify-between">
          <h2
            id="challenge-form-title"
            className="text-xl font-semibold text-[var(--color-slate)]"
          >
            {editingChallenge
              ? "Edit Challenge"
              : "Create Challenge"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="text-xl text-[var(--color-muted)]"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="challenge-title"
              className="text-sm font-medium"
            >
              Challenge Title
            </label>
            <input
              id="challenge-title"
              type="text"
              value={form.title}
              onChange={(event) =>
                updateField("title", event.target.value)
              }
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="challenge-description"
              className="text-sm font-medium"
            >
              Description
            </label>
            <textarea
              id="challenge-description"
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              required
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="challenge-duration"
              className="text-sm font-medium"
            >
              Duration
            </label>
            <input
              id="challenge-duration"
              type="text"
              value={form.duration}
              onChange={(event) =>
                updateField("duration", event.target.value)
              }
              placeholder="e.g. 7 days"
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="challenge-start-date"
              className="text-sm font-medium"
            >
              Start Date
            </label>
            <input
              id="challenge-start-date"
              type="date"
              value={form.startDate}
              onChange={(event) => {
                const value = event.target.value;

                setForm((previous) => ({
                  ...previous,
                  startDate: value,
                  endDate:
                    previous.endDate && previous.endDate < value
                      ? ""
                      : previous.endDate,
                }));

                setError("");
              }}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="challenge-end-date"
              className="text-sm font-medium"
            >
              End Date
            </label>
            <input
              id="challenge-end-date"
              type="date"
              value={form.endDate}
              min={form.startDate || undefined}
              onChange={(event) =>
                updateField("endDate", event.target.value)
              }
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="challenge-status"
              className="text-sm font-medium"
            >
              Challenge Status
            </label>
            <select
              id="challenge-status"
              value={form.status}
              onChange={(event) =>
                updateField("status", event.target.value)
              }
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-gray-300 px-4 py-2"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[var(--color-eco)] px-5 py-2 text-white"
            >
              {editingChallenge
                ? "Update Challenge"
                : "Save Challenge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ChallengeFormModal({
  isOpen,
  onClose,
  onSave,
  editingChallenge,
}) {
  if (!isOpen) {
    return null;
  }

  const formKey = editingChallenge
    ? `edit-${editingChallenge._id || editingChallenge.id || editingChallenge.title}`
    : "create-challenge";

  return (
    <ChallengeForm
      key={formKey}
      onClose={onClose}
      onSave={onSave}
      editingChallenge={editingChallenge}
    />
  );
}
