import { useState } from "react";
import { CATEGORIES, capitalize, toInputDate } from "../utils/challengeUtils";

const ChallengeFormModal = ({ onClose, onSave, editingChallenge }) => {
  const [title, setTitle] = useState(editingChallenge?.title || "");
  const [description, setDescription] = useState(
    editingChallenge?.description || "",
  );
  const [category, setCategory] = useState(
    editingChallenge?.category || CATEGORIES[0],
  );
  const [startDate, setStartDate] = useState(
    toInputDate(editingChallenge?.startDate),
  );
  const [endDate, setEndDate] = useState(
    toInputDate(editingChallenge?.endDate),
  );
  const [targetMetric, setTargetMetric] = useState(
    editingChallenge?.targetMetric ?? "",
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (endDate < startDate) {
      setError("End date must be on or after the start date");
      return;
    }

    setSaving(true);
    try {
      await onSave({
        title,
        description,
        category,
        startDate,
        endDate,
        targetMetric: Number(targetMetric),
      });
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--color-slate)]">
            {editingChallenge ? "Edit Challenge" : "Create Challenge"}
          </h2>

          <button
            onClick={onClose}
            className="text-xl text-[var(--color-muted)]"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label className="text-sm font-medium">Challenge Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label className="text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows="3"
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {capitalize(c)}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-sm font-medium">
                Emission cap (kg CO₂)
              </label>
              <input
                type="number"
                min="0"
                step="any"
                value={targetMetric}
                onChange={(e) => setTargetMetric(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Start date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label className="text-sm font-medium">End date</label>
              <input
                type="date"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

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
              disabled={saving}
              className="rounded-lg bg-[var(--color-eco)] px-5 py-2 text-white disabled:opacity-60"
            >
              {saving
                ? "Saving..."
                : editingChallenge
                  ? "Update Challenge"
                  : "Save Challenge"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChallengeFormModal;
