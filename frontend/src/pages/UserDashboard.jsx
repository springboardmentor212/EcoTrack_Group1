import { Sparkles, Plus } from "lucide-react";
import StatCard from "../components/StatCard";
import GoalRow from "../components/GoalRow";
import CategoryRow from "../components/CategoryRow";
import ChallengeRow from "../components/ChallengeRow";
import TipRow from "../components/TipRow";
import LeaderboardRow from "../components/LeaderboardRow";
import ActivityRow from "../components/ActivityRow";
import { useEffect, useState } from "react";
import { searchCarbonEntries } from "../services/carbonService";
import EmissionTrendChart from "../components/EmissionTrendChart";
import LogEntryModal from "../components/LogEntryModal";
import * as goalService from "../services/goalService";
import {
  getGoalPercent,
  getGoalBarWidth,
  getGoalRemaining,
  formatDeadline,
} from "../utils/goalStatus";

const staticCategoriesFallback = [
  { color: "#0EA5E9", label: "Transportation (35%)", value: "840 kg" },
  { color: "#F59E0B", label: "Electricity (25%)", value: "600 kg" },
  { color: "#10B981", label: "Food (20%)", value: "480 kg" },
  { color: "#6366F1", label: "Water (10%)", value: "240 kg" },
  { color: "#94A3B8", label: "Waste (10%)", value: "240 kg" },
];

const goals = [
  {
    label: "Reduce Carbon Emissions by 20%",
    percent: 68,
    note: "12 days left",
  },
  { label: "Use Public Transport 3x/week", percent: 75, note: "Ongoing" },
  { label: "Reduce Water Usage by 15%", percent: 42, note: "18 days left" },
  { label: "Zero Waste Week Challenge", percent: 90, note: "2 days left" },
];

const challenges = [
  { label: "Plastic-Free Week", note: "3 days left • 156 active" },
  { label: "Cycle to Work", note: "Ongoing • 892 active" },
  { label: "Tree Plantation Drive", note: "5 days left • 2,100 active" },
];

const tips = [
  {
    text: "Switch to LED bulbs to save 75kg CO₂/year",
    note: "Potential: -75kg CO₂",
  },
  {
    text: "Try carpooling on your commute - potential 40% reduction",
    note: "Potential: 120kg CO₂",
  },
  {
    text: "Your water usage peaked Tuesday - consider shorter showers",
    note: "Potential: 15kg CO₂",
  },
];

const leaderboard = [
  { rank: "#1", name: "Trapti", tag: "Super Champion", pts: "98 pts" },
  { rank: "#2", name: "Parnika", tag: "Green Advocate", pts: "94 pts" },
  { rank: "#3", name: "Dharmendra", tag: "Eco Mentor", pts: "89 pts" },
  { rank: "#24", name: "Varsha", tag: "Eco Warrior", pts: "80 pts" },
  { rank: "#25", name: "Harshan", tag: "Active Citizen", pts: "77 pts" },
];

const activity = [
  { text: "Logged bike commute - saved 2.1kg CO₂", time: "2 hours ago" },
  { text: "Completed Plastic-Free challenge", time: "Yesterday" },
  { text: "New badge earned: Eco Warrior", time: "2 days ago" },
  { text: "Goal milestone: 50% water reduction reached", time: "3 days ago" },
];

const notifications = [
  {
    text: "Weekly Report Available - your carbon breakdown is ready",
    time: "10m ago",
  },
  {
    text: "Goal Progress Reminder - 2kg away from your commute milestone",
    time: "2h ago",
  },
  { text: "New Challenge Live! Join Meatless Monday", time: "1d ago" },
];

export default function UserDashboard() {
  const [totalCO2, setTotalCO2] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [isLogEntryModalOpen, setIsLogEntryModalOpen] = useState(false);
  const [dashboardGoals, setDashboardGoals] = useState([]);
  const [goalsSummary, setGoalsSummary] = useState({ active: 0, total: 0 });

  const fetchSummary = async () => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - 30);

    try {
      const res = await searchCarbonEntries({
        from: from.toISOString().slice(0, 10),
        to: to.toISOString().slice(0, 10),
      });

      const entries = res?.data?.carbonEntries || [];

      if (!entries.length) {
        setTotalCO2(null);
        setCategoryBreakdown([]);
        return;
      }

      const total = entries.reduce((sum, e) => sum + (e.calculatedCO2 || 0), 0);
      setTotalCO2(total);

      const colors = {
        transportation: "#0EA5E9",
        energy: "#F59E0B",
        food: "#10B981",
        water: "#6366F1",
        waste: "#94A3B8",
      };

      const byCategory = {};
      entries.forEach((e) => {
        if (e.category) {
          byCategory[e.category] =
            (byCategory[e.category] || 0) + (e.calculatedCO2 || 0);
        }
      });

      setCategoryBreakdown(
        Object.entries(byCategory).map(([label, kg]) => {
          const cleanKey = label.toLowerCase();
          return {
            color: colors[cleanKey] || "#94A3B8",
            label: `${label} (${total ? Math.round((kg / total) * 100) : 0}%)`,
            value: Number(kg.toFixed(1)),
          };
        }),
      );
    } catch (err) {
      setTotalCO2(null);
      setCategoryBreakdown([]);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleEntryAdded = () => {
    fetchSummary();
  };

  const fetchGoalsWidget = async () => {
    try {
      const res = await goalService.getGoals();
      const allGoals = res.data.goals || [];

      const active = allGoals
        .filter((g) => g.status !== "completed")
        .slice(0, 4)
        .map((g) => {
          const remaining = getGoalRemaining(g);
          return {
            label: g.title,
            percent: getGoalBarWidth(g),
            note:
              remaining >= 0
                ? `${remaining} kg CO₂ left this ${g.timeframe.toLowerCase()}`
                : `${Math.abs(remaining)} kg over cap`,
          };
        });
      setDashboardGoals(active);

      const activeCount = allGoals.filter(
        (g) => g.status !== "completed" && g.status !== "paused",
      ).length;
      setGoalsSummary({ active: activeCount, total: allGoals.length });
    } catch (err) {
      setDashboardGoals([]);
      setGoalsSummary({ active: 0, total: 0 });
    }
  };

  useEffect(() => {
    fetchGoalsWidget();
  }, []);

  const statCards = [
    {
      label: "Total Carbon Footprint",
      value:
        totalCO2 !== null
          ? totalCO2 >= 1000
            ? `${(totalCO2 / 1000).toFixed(2)} Tons CO₂`
            : `${totalCO2.toFixed(1)} kg CO₂`
          : "0 kg CO₂",
      trend: "↓ 12% vs last month",
      trendGood: true,
    },
    {
      label: "Sustainability Score",
      value: "78 / 100",
      badge: "Eco Warrior",
      trend: "↑ 4% vs last month",
      trendGood: true,
    },
    {
      label: "Active Goals",
      value:
        goalsSummary.total > 0
          ? `${goalsSummary.active} of ${goalsSummary.total}`
          : "0 of 0",
      trend: goalsSummary.total > 0 ? "On Track vs last month" : "No goals yet",
      trendGood: true,
    },
    {
      label: "Challenge Rank",
      value: "#24 / 1,250",
      trend: "↑ 8 places vs last month",
      trendGood: true,
    },
  ];

  const displayedCategories = categoryBreakdown;

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-10 mb-6">
        <div className="flex col-span-2 bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm gap-12">
          <div>
            <h3 className="font-semibold text-[var(--color-primary)] mb-1">
              Emissions by Category
            </h3>
            <p className="text-xs text-[var(--color-slate)] mb-4">
              {displayedCategories.length} categories compared
            </p>
            <div className="h-40 flex items-center justify-center text-[var(--color-slate)] text-sm">
              <EmissionTrendChart categories={displayedCategories} />
            </div>
          </div>
          <div className="w-full bg-[var(--color-surface)] rounded-2xl p-5">
            <ul className="text-xs space-y-1">
              {displayedCategories.map((cat, i) => (
                <CategoryRow key={i} {...cat} />
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-[var(--color-eco)]/100 rounded-2xl p-5 shadow-sm">
          <h2 className="text-white font-semibold mt-3">Ready to Track?</h2>
          <p className="text-white mt-10">
            Quick log your daily activities to keep your sustainability metrics
            accurate.
          </p>
          <button
            onClick={() => setIsLogEntryModalOpen(true)}
            className="group flex items-center gap-2 mt-8 text-sm antialiased bg-white text-[var(--color-eco)] px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 transform hover:shadow-md hover:brightness-105 active:scale-[0.90]"
          >
            <Plus
              size={20}
              className="transition-transform duration-300 ease-in-out group-hover:rotate-90"
            />{" "}
            Log New Entry
          </button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--color-primary)]">
              Sustainability Goals
            </h3>
            <span className="text-xs font-semibold bg-[var(--color-eco)]/10 text-[var(--color-eco)] px-2 py-1 rounded-full">
              In Progress
            </span>
          </div>
          {dashboardGoals.length ? (
            dashboardGoals.map((goal, i) => <GoalRow key={i} {...goal} />)
          ) : (
            <p className="text-xs text-[var(--color-slate)]">
              No active goals yet.
            </p>
          )}
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-[var(--color-primary)] mb-4">
            Active Challenges
          </h3>
          {challenges.map((c, i) => (
            <ChallengeRow key={i} {...c} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-[var(--color-primary)] mb-4 flex items-center gap-2">
            <Sparkles size={16} /> AI Personalized Eco Tips
          </h3>
          {tips.map((tip, i) => (
            <TipRow key={i} {...tip} />
          ))}
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-[var(--color-primary)] mb-4">
            Community Leaderboard
          </h3>
          {leaderboard.map((entry, i) => (
            <LeaderboardRow key={i} {...entry} />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-[var(--color-primary)] mb-4">
            Recent Activity Feed
          </h3>
          {activity.map((a, i) => (
            <ActivityRow key={i} {...a} />
          ))}
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-[var(--color-primary)] mb-4">
            System Notifications
          </h3>
          {notifications.map((n, i) => (
            <ActivityRow key={i} {...n} />
          ))}
        </div>
      </div>
      <LogEntryModal
        isOpen={isLogEntryModalOpen}
        onClose={() => setIsLogEntryModalOpen(false)}
        onSuccess={handleEntryAdded}
      />
    </>
  );
}
