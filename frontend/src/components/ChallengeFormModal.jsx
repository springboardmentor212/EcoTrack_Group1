
import { useState } from "react";
import {
  CATEGORIES,
  capitalize,
  toInputDate,
} from "../utils/challengeUtils";

const ChallengeFormModal = ({
  onClose,
  onSave,
  editingChallenge,
}) => {
  const [title, setTitle] = useState(
    editingChallenge?.title || ""
  );
  const [description, setDescription] = useState(
    editingChallenge?.description || ""
  );
  const [category, setCategory] = useState(
    editingChallenge?.category || CATEGORIES[0]
  );
  const [startDate, setStartDate] = useState(
    toInputDate(editingChallenge?.startDate)
  );
  const [endDate, setEndDate] = useState(
    toInputDate(editingChallenge?.endDate)
  );
  const [targetMetric, setTargetMetric] = useState(
    editingChallenge?.targetMetric ?? ""
  );
  const [rewardPoints, setRewardPoints] = useState(
    editingChallenge?.rewardPoints ?? 0
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Please enter a challenge title.");
      return;
    }

    if (!description.trim()) {
      setError("Please enter a challenge description.");
      return;
    }

    if (!startDate || !endDate) {
      setError("Please select both dates.");
      return;
    }

    if (endDate <= startDate) {
      setError("End date must be after the start date.");
      return;
    }

    const metric = Number(targetMetric);
    const points = Number(rewardPoints);

    if (
      targetMetric === "" ||
      !Number.isFinite(metric) ||
      metric < 0
    ) {
      setError("Emission cap must be a valid non-negative number.");
      return;
    }

    if (
      rewardPoints === "" ||
      !Number.isInteger(points) ||
      points < 0
    ) {
      setError("Reward points must be a non-negative whole number.");
      return;
    }

    setSaving(true);

    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        category,
        startDate,
        endDate,
        targetMetric: metric,
        rewardPoints: points,
      });
    } catch (err) {
      setError(
        err.message || "Could not save the challenge."
      );
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md px-4">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[var(--color-slate)]">
            {editingChallenge
              ? "Edit Challenge"
              : "Create Challenge"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close challenge form"
            className="text-2xl text-[var(--color-muted)] disabled:opacity-50"
          >
            &times;
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={100}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={3}
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            />
          </div>

          <div>
            <label
              htmlFor="challenge-category"
              className="text-sm font-medium"
            >
              Category
            </label>
            <select
              id="challenge-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
            >
              {CATEGORIES.map((item) => (
                <option key={item} value={item}>
                  {capitalize(item)}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="challenge-cap"
                className="text-sm font-medium"
              >
                Emission cap (kg CO₂e)
              </label>
              <input
                id="challenge-cap"
                type="number"
                min="0"
                step="any"
                value={targetMetric}
                onChange={(e) => setTargetMetric(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="challenge-points"
                className="text-sm font-medium"
              >
                Reward points
              </label>
              <input
                id="challenge-points"
                type="number"
                min="0"
                step="1"
                value={rewardPoints}
                onChange={(e) => setRewardPoints(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="challenge-start"
                className="text-sm font-medium"
              >
                Start date
              </label>
              <input
                id="challenge-start"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>

            <div>
              <label
                htmlFor="challenge-end"
                className="text-sm font-medium"
              >
                End date
              </label>
              <input
                id="challenge-end"
                type="date"
                value={endDate}
                min={startDate || undefined}
                onChange={(e) => setEndDate(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2"
              />
            </div>
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

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
