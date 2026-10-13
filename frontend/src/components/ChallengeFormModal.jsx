
import { useState } from "react";

const CATEGORIES = [
  { value: "transportation", label: "Transportation" },
  { value: "energy", label: "Energy" },
  { value: "food", label: "Food" },
  { value: "waste", label: "Waste" },
  { value: "water", label: "Water" },
];

const getInitialValues = (challenge) => ({
  title: challenge?.title ?? "",
  description: challenge?.description ?? "",
  category: challenge?.category ?? "transportation",
  points: challenge?.points ?? challenge?.targetMetric ?? 100,
  duration: challenge?.duration ?? "",
  status: challenge?.status ?? "Active",
  startDate: challenge?.startDate
    ? String(challenge.startDate).slice(0, 10)
    : "",
  endDate: challenge?.endDate
    ? String(challenge.endDate).slice(0, 10)
    : "",
});

const calculateDuration = (startDate, endDate) => {
  // Date inputs use YYYY-MM-DD, so UTC avoids daylight-saving issues.
  const start = new Date(`${startDate}T00:00:00Z`).getTime();
  const end = new Date(`${endDate}T00:00:00Z`).getTime();

  const days = Math.round((end - start) / (1000 * 60 * 60 * 24));

  return `${Math.max(1, days)} days`;
};

function ChallengeForm({ onClose, onSave, editingChallenge }) {
  const [form, setForm] = useState(() =>
    getInitialValues(editingChallenge)
  );
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const updateField = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (saving) return;

    const title = form.title.trim();
    const description = form.description.trim();
    const category = form.category;
    const points = Number(form.points);
    const { startDate, endDate, status } = form;

    // Required field validation
    if (
      !title ||
      !description ||
      !category ||
      form.points === "" ||
      !startDate ||
      !endDate
    ) {
      setError("Please fill in all required fields.");
      return;
    }

    // Category validation
    if (!CATEGORIES.some((item) => item.value === category)) {
      setError("Please select a valid challenge category.");
      return;
    }

    // Points validation
    if (
      !Number.isFinite(points) ||
      !Number.isInteger(points) ||
      points <= 0
    ) {
      setError("Reward points must be a positive whole number.");
      return;
    }

    // Date validation
    if (endDate < startDate) {
      setError("End date must be on or after the start date.");
      return;
    }

    const calculatedDuration =
      form.duration.trim() || calculateDuration(startDate, endDate);

    const challengeData = {
      ...(editingChallenge || {}),
      title,
      description,
      category,
      points,
      targetMetric: points,
      duration: calculatedDuration,
      status,
      startDate,
      endDate,
    };

    try {
      setSaving(true);
      setError("");

      // Supports synchronous and asynchronous parent save handlers.
      await onSave(challengeData);
      onClose();
    } catch (saveError) {
      setError(
        saveError?.response?.data?.message ||
          saveError?.message ||
          "Unable to save the challenge. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-6">
      <div
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl"
        role="dialog"
        aria-modal="true"
        aria-labelledby="challenge-form-title"
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-4">
          <h2
            id="challenge-form-title"
            className="text-xl font-semibold text-[var(--color-slate)]"
          >
            {editingChallenge ? "Edit Challenge" : "Create Challenge"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal"
            className="text-xl text-[var(--color-muted)] disabled:opacity-50"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          {/* Challenge title */}
          <div>
            <label
              htmlFor="challenge-title"
              className="text-sm font-medium"
            >
              Challenge Title *
            </label>

            <input
              id="challenge-title"
              type="text"
              value={form.title}
              onChange={(event) =>
                updateField("title", event.target.value)
              }
              maxLength={120}
              required
              disabled={saving}
              placeholder="Enter challenge title"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="challenge-description"
              className="text-sm font-medium"
            >
              Description *
            </label>

            <textarea
              id="challenge-description"
              value={form.description}
              onChange={(event) =>
                updateField("description", event.target.value)
              }
              maxLength={1000}
              required
              disabled={saving}
              rows={3}
              placeholder="Describe the challenge and its goal"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* Category */}
          <div>
            <label
              htmlFor="challenge-category"
              className="text-sm font-medium"
            >
              Category *
            </label>

            <select
              id="challenge-category"
              value={form.category}
              onChange={(event) =>
                updateField("category", event.target.value)
              }
              required
              disabled={saving}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
            >
              {CATEGORIES.map((category) => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reward points */}
          <div>
            <label
              htmlFor="challenge-points"
              className="text-sm font-medium"
            >
              Reward Points *
            </label>

            <input
              id="challenge-points"
              type="number"
              min="1"
              step="1"
              value={form.points}
              onChange={(event) =>
                updateField("points", event.target.value)
              }
              required
              disabled={saving}
              placeholder="Enter reward points"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* Start date */}
          <div>
            <label
              htmlFor="challenge-start-date"
              className="text-sm font-medium"
            >
              Start Date *
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
              disabled={saving}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* End date */}
          <div>
            <label
              htmlFor="challenge-end-date"
              className="text-sm font-medium"
            >
              End Date *
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
              disabled={saving}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* Optional duration override */}
          <div>
            <label
              htmlFor="challenge-duration"
              className="text-sm font-medium"
            >
              Duration (optional)
            </label>

            <input
              id="challenge-duration"
              type="text"
              value={form.duration}
              onChange={(event) =>
                updateField("duration", event.target.value)
              }
              disabled={saving}
              placeholder="Leave blank to calculate from dates"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          {/* Preserve the existing status field */}
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
              disabled={saving}
              className="mt-1 w-full rounded-lg border border-gray-300 bg-white px-3 py-2"
            >
              <option value="Active">Active</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          {/* Validation and API errors */}
          {error && (
            <p className="text-sm text-red-600" role="alert">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-3">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="rounded-lg border border-gray-300 px-4 py-2 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-[var(--color-eco)] px-5 py-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : editingChallenge
                  ? "Update Challenge"
                  : "Create Challenge"}
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
