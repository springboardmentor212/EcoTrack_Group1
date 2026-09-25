import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Check, Plus } from "lucide-react";
import GoalModal from "../components/GoalModal";
import * as goalService from "../services/goalService";
import {
  getGoalPercent,
  getGoalBarWidth,
  getGoalRemaining,
  getGoalStatus,
  getPeriodLabel,
  formatDeadline,
} from "../utils/goalStatus";

export default function GoalDetail() {
  const [goal, setGoal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newMilestone, setNewMilestone] = useState("");
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchGoal = async () => {
    setLoading(true);
    try {
      const res = await goalService.getGoalById(id);
      setGoal(res.data.goal);
    } catch (err) {
      console.error("Failed to load goal", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoal();
  }, [id]);

  const handleSaveEdit = async (formData) => {
    await goalService.updateGoal(id, formData);
    setIsEditModalOpen(false);
    fetchGoal();
  };

  const handleDelete = async () => {
    await goalService.deleteGoal(id);
    navigate("/goals");
  };

  const markComplete = async () => {
    const res = await goalService.updateGoal(id, { status: "completed" });
    setGoal(res.data.goal);
  };

  const toggleMilestone = async (milestoneId) => {
    const previousMilestones = goal.milestones;
    const updatedMilestones = goal.milestones.map((m) =>
      m._id === milestoneId ? { ...m, isCompleted: !m.isCompleted } : m,
    );
    setGoal({ ...goal, milestones: updatedMilestones });
    try {
      await goalService.updateGoal(id, { milestones: updatedMilestones });
    } catch (err) {
      console.error("Failed to update milestone", err);
      setGoal({ ...goal, milestones: previousMilestones });
    }
  };

  const addMilestone = async (e) => {
    e.preventDefault();
    if (!newMilestone.trim()) return;
    const titleToAdd = newMilestone;
    const updatedMilestones = [
      ...(goal.milestones || []),
      { title: titleToAdd, isCompleted: false },
    ];
    setNewMilestone("");
    try {
      const res = await goalService.updateGoal(id, {
        milestones: updatedMilestones,
      });
      setGoal(res.data.goal);
    } catch (err) {
      console.error("Failed to add milestone", err);
      setNewMilestone(titleToAdd);
    }
  };

  if (loading)
    return <p className="text-sm text-[var(--color-slate)]">Loading goal...</p>;
  if (!goal)
    return <p className="text-sm text-[var(--color-slate)]">Goal not found.</p>;

  const percent = getGoalPercent(goal);
  const barWidth = getGoalBarWidth(goal);
  const remaining = getGoalRemaining(goal);
  const status = getGoalStatus(goal);
  const periodLabel = getPeriodLabel(goal.timeframe);
  const milestones = goal.milestones || [];
  const completedCount = milestones.filter((m) => m.isCompleted).length;

  const statusColors = {
    "On Track": "text-[var(--color-eco)]",
    "Over Cap": "text-red-500",
    Completed: "text-blue-600",
  };

  const remainingText =
    remaining >= 0
      ? `${remaining} kg CO₂ still available`
      : `${Math.abs(remaining)} kg CO₂ over cap`;

  return (
    <div>
      <p className="text-xs text-[var(--color-slate)] mb-1">
        Goals / Goal Detail
      </p>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">
            {goal.title}
          </h1>
          <p className="text-sm text-[var(--color-slate)] mt-1">
            {goal.description ||
              `Stay under ${goal.target} kg CO₂ from ${goal.category} ${periodLabel}.`}
          </p>
        </div>
        <div className="flex gap-3">
          {status !== "Completed" && (
            <button
              onClick={markComplete}
              className="px-4 py-2 text-sm border border-[var(--color-eco)] text-[var(--color-eco)] rounded-lg cursor-pointer hover:bg-[var(--color-eco)]/10"
            >
              Mark Complete
            </button>
          )}
          <button
            onClick={() => setIsEditModalOpen(true)}
            className="px-4 py-2 text-sm bg-[var(--color-eco)] text-white rounded-lg cursor-pointer transition-all duration-300 transform hover:shadow-md hover:brightness-95 active:scale-[0.90] antialiased"
          >
            Edit Goal
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-[var(--color-slate)]">
            Used {periodLabel}
          </p>
          <p className="text-xl font-bold text-[var(--color-primary)]">
            {goal.currentValue ?? 0} kg CO₂
          </p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-[var(--color-slate)]">
            Emission Cap ({goal.timeframe})
          </p>
          <p className="text-xl font-bold text-[var(--color-primary)]">
            {goal.target} kg CO₂
          </p>
          <p className="text-[11px] text-[var(--color-slate)] mt-1">
            {remainingText}
          </p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-[var(--color-slate)]">
            Target End: {formatDeadline(goal.deadline)}
          </p>
          <p className={`text-xl font-bold ${statusColors[status] || ""}`}>
            {percent}%{" "}
            <span className="text-xs text-[var(--color-slate)] font-normal">
              ({status})
            </span>
          </p>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-[var(--color-primary)]">
            Cap Usage
          </h3>
          <span className="text-xs text-[var(--color-slate)]">
            Resets every {goal.timeframe.toLowerCase()}
          </span>
        </div>
        <div className="h-3 bg-[var(--color-background)] rounded-full overflow-hidden">
          <div
            className={`h-full ${status === "Over Cap" ? "bg-red-500" : "bg-[var(--color-eco)]"}`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-[var(--color-primary)]">
            Goal Milestones
            <span className="text-xs font-normal text-[var(--color-slate)] ml-2">
              {completedCount}/{milestones.length} done
            </span>
          </h3>
          <form onSubmit={addMilestone} className="flex gap-2">
            <input
              type="text"
              placeholder="Add milestone..."
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              className="border border-[var(--color-slate)]/40 rounded-lg p-1.5 text-xs outline-none w-48"
            />
            <button
              type="submit"
              className="flex items-center gap-1 text-xs px-3 py-1.5 bg-[var(--color-eco)] text-white rounded-lg cursor-pointer"
            >
              <Plus size={14} /> Add
            </button>
          </form>
        </div>

        {milestones.length === 0 ? (
          <p className="text-xs text-[var(--color-slate)]">
            No milestones yet — add concrete steps you're taking toward this
            goal (e.g. "Switch to LED bulbs").
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {milestones.map((m) => (
              <button
                key={m._id}
                onClick={() => toggleMilestone(m._id)}
                className={`text-left p-3 rounded-xl border transition cursor-pointer ${
                  m.isCompleted
                    ? "bg-[var(--color-eco)]/10 border-[var(--color-eco)]/30"
                    : "bg-[var(--color-background)] border-[var(--color-slate)]/20 hover:border-[var(--color-slate)]/40"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center ${
                      m.isCompleted
                        ? "bg-[var(--color-eco)] text-white"
                        : "border border-[var(--color-slate)]"
                    }`}
                  >
                    {m.isCompleted && <Check size={12} />}
                  </span>
                  <span
                    className={`text-sm ${m.isCompleted ? "text-[var(--color-muted)] line-through" : "text-[var(--color-primary)]"}`}
                  >
                    {m.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-[var(--color-primary)] mb-2">
          AI Optimization Tips
        </h3>
        <p className="text-xs text-[var(--color-slate)]">
          Switching your appliance standby mode to Eco Save automatically halves
          idle power consumption without active management.
        </p>
      </div>

      <GoalModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        editGoal={goal}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}
