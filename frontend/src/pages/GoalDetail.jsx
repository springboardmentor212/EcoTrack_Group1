
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

  // Fetch goal details
  const fetchGoal = async (signal) => {
    try {
      const res = await goalService.getGoalById(id);

      if (!signal?.aborted) {
        setGoal(res.data.goal);
      }
    } catch (err) {
      if (!signal?.aborted) {
        console.error("Failed to load goal", err);
        setGoal(null);
      }
    } finally {
      if (!signal?.aborted) {
        setLoading(false);
      }
    }
  };

  // Load goal when the ID changes
  useEffect(() => {
    const controller = new AbortController();

    const loadGoal = async () => {
      setLoading(true);
      setGoal(null);

      try {
        const res = await goalService.getGoalById(id);

        if (!controller.signal.aborted) {
          setGoal(res.data.goal);
        }
      } catch (err) {
        if (!controller.signal.aborted) {
          console.error("Failed to load goal", err);
          setGoal(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadGoal();

    return () => {
      controller.abort();
    };
  }, [id]);

  // Save edited goal
  const handleSaveEdit = async (formData) => {
    try {
      await goalService.updateGoal(id, formData);
      setIsEditModalOpen(false);
      await fetchGoal();
    } catch (err) {
      console.error("Failed to update goal", err);
    }
  };

  // Delete goal
  const handleDelete = async () => {
    try {
      await goalService.deleteGoal(id);
      navigate("/goals");
    } catch (err) {
      console.error("Failed to delete goal", err);
    }
  };

  // Mark goal as completed
  const markComplete = async () => {
    try {
      const res = await goalService.updateGoal(id, {
        status: "completed",
      });

      setGoal(res.data.goal);
    } catch (err) {
      console.error("Failed to complete goal", err);
    }
  };

  // Toggle milestone completion
  const toggleMilestone = async (milestoneId) => {
    if (!goal) return;

    const previousMilestones = goal.milestones || [];

    const updatedMilestones = previousMilestones.map((milestone) =>
      milestone._id === milestoneId
        ? {
            ...milestone,
            isCompleted: !milestone.isCompleted,
          }
        : milestone
    );

    setGoal({
      ...goal,
      milestones: updatedMilestones,
    });

    try {
      const res = await goalService.updateGoal(id, {
        milestones: updatedMilestones,
      });

      setGoal(res.data.goal);
    } catch (err) {
      console.error("Failed to update milestone", err);

      setGoal((currentGoal) =>
        currentGoal
          ? {
              ...currentGoal,
              milestones: previousMilestones,
            }
          : currentGoal
      );
    }
  };

  // Add a new milestone
  const addMilestone = async (e) => {
    e.preventDefault();

    if (!newMilestone.trim() || !goal) return;

    const titleToAdd = newMilestone.trim();

    const updatedMilestones = [
      ...(goal.milestones || []),
      {
        title: titleToAdd,
        isCompleted: false,
      },
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

  if (loading) {
    return (
      <p className="text-sm text-[var(--color-slate)]">
        Loading goal...
      </p>
    );
  }

  if (!goal) {
    return (
      <p className="text-sm text-[var(--color-slate)]">
        Goal not found.
      </p>
    );
  }

  const percent = getGoalPercent(goal);
  const barWidth = getGoalBarWidth(goal);
  const remaining = getGoalRemaining(goal);
  const status = getGoalStatus(goal);
  const periodLabel = getPeriodLabel(goal.timeframe);
  const milestones = goal.milestones || [];
  const completedCount = milestones.filter(
    (milestone) => milestone.isCompleted
  ).length;

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
      <p className="mb-1 text-xs text-[var(--color-slate)]">
        Goals / Goal Detail
      </p>

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">
            {goal.title}
          </h1>

          <p className="mt-1 text-sm text-[var(--color-slate)]">
            {goal.description ||
              `Stay under ${goal.target} kg CO₂ from ${goal.category} ${periodLabel}.`}
          </p>
        </div>

        <div className="flex gap-3">
          {status !== "Completed" && (
            <button
              type="button"
              onClick={markComplete}
              className="cursor-pointer rounded-lg border border-[var(--color-eco)] px-4 py-2 text-sm text-[var(--color-eco)] hover:bg-[var(--color-eco)]/10"
            >
              Mark Complete
            </button>
          )}

          <button
            type="button"
            onClick={() => setIsEditModalOpen(true)}
            className="transform cursor-pointer rounded-lg bg-[var(--color-eco)] px-4 py-2 text-sm text-white transition-all duration-300 hover:brightness-95 hover:shadow-md active:scale-[0.90]"
          >
            Edit Goal
          </button>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[var(--color-surface)] p-5 shadow-sm">
          <p className="text-xs text-[var(--color-slate)]">
            Used {periodLabel}
          </p>
          <p className="text-xl font-bold text-[var(--color-primary)]">
            {goal.currentValue ?? 0} kg CO₂
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--color-surface)] p-5 shadow-sm">
          <p className="text-xs text-[var(--color-slate)]">
            Emission Cap ({goal.timeframe})
          </p>
          <p className="text-xl font-bold text-[var(--color-primary)]">
            {goal.target} kg CO₂
          </p>
          <p className="mt-1 text-[11px] text-[var(--color-slate)]">
            {remainingText}
          </p>
        </div>

        <div className="rounded-2xl bg-[var(--color-surface)] p-5 shadow-sm">
          <p className="text-xs text-[var(--color-slate)]">
            Target End: {formatDeadline(goal.deadline)}
          </p>
          <p
            className={`text-xl font-bold ${statusColors[status] || ""}`}
          >
            {percent}%{" "}
            <span className="text-xs font-normal text-[var(--color-slate)]">
              ({status})
            </span>
          </p>
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-[var(--color-surface)] p-5 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-[var(--color-primary)]">
            Cap Usage
          </h3>
          <span className="text-xs text-[var(--color-slate)]">
            Resets every {goal.timeframe.toLowerCase()}
          </span>
        </div>

        <div className="h-3 overflow-hidden rounded-full bg-[var(--color-background)]">
          <div
            className={`h-full ${
              status === "Over Cap"
                ? "bg-red-500"
                : "bg-[var(--color-eco)]"
            }`}
            style={{ width: `${barWidth}%` }}
          />
        </div>
      </div>

      <div className="mb-6 rounded-2xl bg-[var(--color-surface)] p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-semibold text-[var(--color-primary)]">
            Goal Milestones
            <span className="ml-2 text-xs font-normal text-[var(--color-slate)]">
              {completedCount}/{milestones.length} done
            </span>
          </h3>

          <form onSubmit={addMilestone} className="flex gap-2">
            <input
              type="text"
              placeholder="Add milestone..."
              value={newMilestone}
              onChange={(e) => setNewMilestone(e.target.value)}
              className="w-48 rounded-lg border border-[var(--color-slate)]/40 p-1.5 text-xs outline-none"
            />

            <button
              type="submit"
              className="flex cursor-pointer items-center gap-1 rounded-lg bg-[var(--color-eco)] px-3 py-1.5 text-xs text-white"
            >
              <Plus size={14} />
              Add
            </button>
          </form>
        </div>

        {milestones.length === 0 ? (
          <p className="text-xs text-[var(--color-slate)]">
            No milestones yet — add concrete steps you're taking toward
            this goal (e.g. "Switch to LED bulbs").
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-3">
            {milestones.map((milestone, index) => (
              <button
                key={milestone._id || `${milestone.title}-${index}`}
                type="button"
                onClick={() => toggleMilestone(milestone._id)}
                className={`cursor-pointer rounded-xl border p-3 text-left transition ${
                  milestone.isCompleted
                    ? "border-[var(--color-eco)]/30 bg-[var(--color-eco)]/10"
                    : "border-[var(--color-slate)]/20 bg-[var(--color-background)] hover:border-[var(--color-slate)]/40"
                }`}
              >
                <div className="flex items-start gap-2">
                  <span
                    className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                      milestone.isCompleted
                        ? "bg-[var(--color-eco)] text-white"
                        : "border border-[var(--color-slate)]"
                    }`}
                  >
                    {milestone.isCompleted && <Check size={12} />}
                  </span>

                  <span
                    className={`text-sm ${
                      milestone.isCompleted
                        ? "text-[var(--color-muted)] line-through"
                        : "text-[var(--color-primary)]"
                    }`}
                  >
                    {milestone.title}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-2xl bg-[var(--color-surface)] p-5 shadow-sm">
        <h3 className="mb-2 font-semibold text-[var(--color-primary)]">
          AI Optimization Tips
        </h3>
        <p className="text-xs text-[var(--color-slate)]">
          Switching your appliance standby mode to Eco Save automatically
          halves idle power consumption without active management.
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
