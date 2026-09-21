import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function GoalModal({
  isOpen,
  onClose,
  onSave,
  editGoal = null,
}) {
  const [form, setForm] = useState({
    title: "",
    category: "Transportation",
    targetValue: "80.00",
    unit: "kg CO2",
    baseline: "124",
    deadline: "2026-12-31",
    reminderFrequency: "Weekly",
    priority: "Medium",
    notes: "",
  });

  useEffect(() => {
    if (editGoal) {
      setForm({
        title: editGoal.title || "Reduce Commute Carbon",
        category: editGoal.category || "Transportation",
        targetValue: editGoal.targetValue || "80.00",
        unit: editGoal.unit || "kg CO2",
        baseline: editGoal.baseline || "124",
        deadline: editGoal.deadline || "2026-12-31",
        reminderFrequency: editGoal.reminderFrequency || "Weekly",
        priority: editGoal.priority || "Medium",
        notes: editGoal.notes || "",
      });
    }
  }, [editGoal]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
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
              placeholder="e.g. Reduce daily commute footprint"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
              required
            />
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-slate)]">
              Goal Category
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
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[var(--color-slate)]">
                Target Value
              </label>
              <input
                type="number"
                step="0.01"
                value={form.targetValue}
                onChange={(e) =>
                  setForm({ ...form, targetValue: e.target.value })
                }
                className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-slate)]">
                Unit
              </label>
              <input
                type="text"
                value={form.unit}
                onChange={(e) => setForm({ ...form, unit: e.target.value })}
                className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
              />
            </div>
          </div>

          <div className="bg-gray-50 p-3 rounded-xl border border-[var(--color-slate)]/20 text-xs">
            <span className="font-semibold text-[var(--color-primary)]">
              Current Baseline (Auto-populated):
            </span>
            <p className="text-[var(--color-slate)] mt-0.5">
              Based on last month: {form.baseline} kg CO₂ / week
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-[var(--color-slate)]">
                Deadline
              </label>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--color-slate)]">
                Reminder Frequency
              </label>
              <select
                value={form.reminderFrequency}
                onChange={(e) =>
                  setForm({ ...form, reminderFrequency: e.target.value })
                }
                className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
              >
                <option>Daily</option>
                <option>Weekly</option>
                <option>Monthly</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-slate)] block mb-1">
              Priority
            </label>
            <div className="flex gap-2">
              {["Low", "Medium", "High"].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p })}
                  className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border cursor-pointer ${
                    form.priority === p
                      ? "bg-[var(--color-primary)] text-white border-[var(--color-primary)]"
                      : "border-[var(--color-slate)]/30 text-[var(--color-slate)] hover:bg-gray-50"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-[var(--color-slate)]">
              Description / Notes
            </label>
            <textarea
              rows={2}
              placeholder="Add extra details or guidelines for this goal..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
            />
          </div>

          <div className="flex justify-between items-center pt-3 border-t border-[var(--color-slate)]/10">
            {editGoal ? (
              <button
                type="button"
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
                className="px-4 py-2 bg-[var(--color-eco)] text-white rounded-lg text-sm font-medium cursor-pointer hover:brightness-95"
              >
                {editGoal ? "Save Changes" : "Create Goal"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
