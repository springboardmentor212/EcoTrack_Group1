import { useState, useEffect } from "react";
import { X } from "lucide-react";

const emptyForm = {
  title: "",
  description: "",
  category: "Transportation",
  target: "50",
  timeframe: "Monthly",
  deadline: "2026-12-31",
};

export default function GoalModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  editGoal = null,
}) {
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editGoal) {
      setForm({
        title: editGoal.title || "",
        description: editGoal.description || "",
        category: editGoal.category || "Transportation",
        target: editGoal.target ?? "50",
        timeframe: editGoal.timeframe || "Monthly",
        deadline: editGoal.deadline
          ? editGoal.deadline.slice(0, 10)
          : "2026-12-31",
      });
    } else {
      setForm(emptyForm);
    }
  }, [editGoal, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ ...form, target: Number(form.target) });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--color-surface)] w-full max-w-lg rounded-2xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-slate)]/20 mb-4">
          <h2 className="text-xl font-bold text-[var(--color-primary)]">
            {editGoal ? "Edit Goal" : "Create New Goal"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-[var(--color-slate)] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-medium text-[var(--color-slate)]">
              Goal Title
            </label>
            <input
              type="text"
              placeholder="e.g. Lower household electricity usage"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-slate)]">
              Category
            </label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
            >
              <option>Transportation</option>
              <option>Energy</option>
              <option>Food & Diet</option>
              <option>Waste</option>
              <option>Water</option>
            </select>
            <p className="text-[10px] text-[var(--color-slate)] mt-1">
              Matches the category you use when logging entries in Carbon
              Tracker.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[var(--color-slate)]">
                Emission Cap (kg CO₂)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                value={form.target}
                onChange={(e) => setForm({ ...form, target: e.target.value })}
                className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                required
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-slate)]">
                Cap Resets
              </label>
              <select
                value={form.timeframe}
                onChange={(e) =>
                  setForm({ ...form, timeframe: e.target.value })
                }
                className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl border border-[var(--color-slate)]/20 text-xs text-[var(--color-slate)]">
            You're aiming to stay{" "}
            <strong>under {form.target || 0} kg CO₂</strong> from{" "}
            <strong>{form.category}</strong> entries, every{" "}
            <strong>{form.timeframe.toLowerCase()}</strong> period — this is a
            ceiling to avoid, not a target to hit.
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-slate)]">
              Target End Date
            </label>
            <input
              type="date"
              value={form.deadline}
              onChange={(e) => setForm({ ...form, deadline: e.target.value })}
              className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
              required
            />
            <p className="text-[10px] text-[var(--color-slate)] mt-1">
              When you'd like this habit to be established by — for reference,
              doesn't affect the cap math.
            </p>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-slate)]">
              Description / Notes
            </label>
            <textarea
              rows={2}
              placeholder="Add extra details or guidelines for this goal..."
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
              className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
            />
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-[var(--color-slate)]/10">
            {editGoal ? (
              <button
                type="button"
                onClick={() => onDelete && onDelete(editGoal._id)}
                className="px-3 py-1.5 text-xs text-red-600 border border-red-200 rounded-lg hover:bg-red-50 cursor-pointer"
              >
                Delete Goal
              </button>
            ) : (
              <div />
            )}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[var(--color-slate)]/40 rounded-lg text-sm cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-4 py-2 bg-[var(--color-eco)] text-white rounded-lg text-sm font-medium cursor-pointer hover:brightness-95 disabled:opacity-60"
              >
                {saving
                  ? "Saving..."
                  : editGoal
                    ? "Save Changes"
                    : "Create Goal"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
