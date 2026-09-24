import { useEffect, useState } from "react";
import GoalCard from "../components/GoalCard";
import GoalModal from "../components/GoalModal";
import * as goalService from "../services/goalService";
import {
  getGoalPercent,
  getGoalBarWidth,
  getGoalRemaining,
  getGoalStatus,
  formatDeadline,
} from "../utils/goalStatus";

const tabs = ["All", "On Track", "Over Cap", "Completed"];

export default function Goals() {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [tab, setTab] = useState("All");

  const fetchGoals = async () => {
    setLoading(true);
    try {
      const res = await goalService.getGoals();
      setGoals(res.data.goals || []);
    } catch (err) {
      console.error("Failed to load goals", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleCreate = async (formData) => {
    await goalService.createGoal(formData);
    setIsGoalModalOpen(false);
    fetchGoals();
  };

  const mapped = goals.map((g) => ({
    id: g._id,
    category: g.category,
    title: g.title,
    percent: getGoalPercent(g),
    barWidth: getGoalBarWidth(g),
    remaining: getGoalRemaining(g),
    timeframe: g.timeframe,
    deadline: formatDeadline(g.deadline),
    status: getGoalStatus(g),
  }));

  const filtered = mapped.filter((g) => tab === "All" || g.status === tab);

  const onTrackCount = mapped.filter((g) => g.status === "On Track").length;
  const overCapCount = mapped.filter((g) => g.status === "Over Cap").length;
  const completedCount = mapped.filter((g) => g.status === "Completed").length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">
            Sustainability Goals
          </h1>
          <p className="text-sm text-[var(--color-slate)] mt-1">
            {onTrackCount} On Track · {overCapCount} Over Cap · {completedCount}{" "}
            Completed
          </p>
        </div>
        <button
          onClick={() => setIsGoalModalOpen(true)}
          className="bg-[var(--color-eco)] text-white text-sm px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:shadow-md hover:brightness-95 active:scale-[0.90] antialiased"
        >
          Create New Goal
        </button>
      </div>

      <div className="flex gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`text-sm px-4 py-1.5 rounded-full ${
              tab === t
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface)] text-[var(--color-slate)]"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-sm text-[var(--color-slate)]">Loading goals...</p>
      ) : filtered.length === 0 ? (
        <p className="text-sm text-[var(--color-slate)]">
          No goals in this category yet.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {filtered.map((goal) => (
            <GoalCard key={goal.id} {...goal} />
          ))}
        </div>
      )}

      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
        onSave={handleCreate}
      />
    </div>
  );
}
