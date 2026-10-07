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
import * as challengeService from "../services/challengeService";
import {
  getGoalPercent,
  getGoalBarWidth,
  getGoalRemaining,
  formatDeadline,
} from "../utils/goalStatus";
import {
  calculateSustainabilityScore,
  getScoreBadge,
} from "../utils/sustainabilityScore";
import { useNavigate } from "react-router-dom";
import { api } from "../services/ecoApi";
import { SCORE_REFRESH_EVENT } from "../hooks/useSustainabilityScore";

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

const leaderboard = [
  { rank: "#1", name: "Trapti", tag: "Super Champion", pts: "98 pts" },
  { rank: "#2", name: "Parnika", tag: "Green Advocate", pts: "94 pts" },
  { rank: "#3", name: "Dharmendra", tag: "Eco Mentor", pts: "89 pts" },
  { rank: "#24", name: "Varsha", tag: "Eco Warrior", pts: "80 pts" },
  { rank: "#25", name: "Harshan", tag: "Active Citizen", pts: "77 pts" },
];

export default function UserDashboard() {
  const [totalCO2, setTotalCO2] = useState(null);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [isLogEntryModalOpen, setIsLogEntryModalOpen] = useState(false);
  const [dashboardGoals, setDashboardGoals] = useState([]);
  const [goalsSummary, setGoalsSummary] = useState({ active: 0, total: 0 });
  const [recentEntries, setRecentEntries] = useState([]);
  const [scoreGoals, setScoreGoals] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);

  const navigate = useNavigate();
  const [tips, setTips] = useState([]);
  const [tipsLoading, setTipsLoading] = useState(true);

  const fetchTips = async () => {
    try {
      const res = await api.getRecommendations();
      const list = (res?.data || [])
        .filter((r) => r.status !== "dismissed")
        .sort((a, b) => b.impactScore - a.impactScore)
        .slice(0, 3);
      setTips(list);
    } catch (err) {
      setTips([]);
    } finally {
      setTipsLoading(false);
    }
  };

  useEffect(() => {
    fetchTips();
  }, []);

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
      setRecentEntries(entries);

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
      setRecentEntries([]);
      setTotalCO2(null);
      setCategoryBreakdown([]);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const handleEntryAdded = () => {
    fetchSummary();
    fetchGoalsWidget();
    fetchChallengesWidget();
    window.dispatchEvent(new Event(SCORE_REFRESH_EVENT));
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

      const activeGoals = allGoals.filter(
        (g) => g.status !== "completed" && g.status !== "paused",
      );
      setGoalsSummary({ active: activeGoals.length, total: allGoals.length });

      setScoreGoals(activeGoals.map((g) => ({ percent: getGoalBarWidth(g) })));
    } catch (err) {
      setDashboardGoals([]);
      setScoreGoals([]);
      setGoalsSummary({ active: 0, total: 0 });
    }
  };

  useEffect(() => {
    fetchGoalsWidget();
  }, []);

  const fetchChallengesWidget = async () => {
    try {
      const res = await challengeService.getMyChallenges();
      setMyChallenges(res.data.data || []);
    } catch (err) {
      setMyChallenges([]);
    }
  };

  useEffect(() => {
    fetchChallengesWidget();
  }, []);

  /* ---------- challenges ---------- */
  const activeChallenges = myChallenges.filter((c) => c.status === "active");

  const challengeRows = activeChallenges.slice(0, 3).map((c) => ({
    label: c.title,
    note: `${c.daysLeft} ${c.daysLeft === 1 ? "day" : "days"} left • ${c.participantsCount} active`,
  }));

  const bestRanked = activeChallenges
    .filter((c) => c.rank)
    .sort((a, b) => a.rank - b.rank)[0];

  /* ---------- sustainability score ---------- */
  const hasScoreData = recentEntries.length > 0;
  const sustainabilityScore = calculateSustainabilityScore(
    recentEntries,
    scoreGoals,
  );
  const scoreValue = (
    <>
      {hasScoreData ? sustainabilityScore : "—"}
      <span className="ml-1 text-base font-normal text-[var(--color-primary)]">
        / 100
      </span>
    </>
  );

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
      value: scoreValue,
      badge: hasScoreData ? getScoreBadge(sustainabilityScore) : undefined,
      trend: hasScoreData
        ? "Based on the last 30 days"
        : "Log an entry to get your score",
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
      value: bestRanked
        ? `#${bestRanked.rank} / ${bestRanked.participantsCount}`
        : "—",
      trend: bestRanked
        ? `in ${bestRanked.title}`
        : "Join a challenge to get ranked",
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
          {challengeRows.length ? (
            challengeRows.map((c, i) => <ChallengeRow key={i} {...c} />)
          ) : (
            <p className="text-xs text-[var(--color-slate)]">
              You haven't joined any active challenges yet.
            </p>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--color-primary)] flex items-center gap-2">
              <Sparkles size={16} /> AI Personalized Eco Tips
            </h3>
            <button
              onClick={() => navigate("/recommendations")}
              className="text-xs font-semibold text-[var(--color-eco)] hover:underline"
            >
              View all
            </button>
          </div>

          {tipsLoading ? (
            <p className="text-xs text-[var(--color-slate)]">Loading tips…</p>
          ) : tips.length ? (
            tips.map((tip) => (
              <div
                key={tip._id}
                onClick={() => navigate("/recommendations")}
                className="mb-3 cursor-pointer rounded-lg border border-[var(--color-eco)] bg-[var(--color-eco)]/10 px-3 py-2 transition hover:shadow-sm"
              >
                <p className="text-sm text-[var(--color-primary)]">
                  {tip.title}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-slate)]">
                  {tip.category.charAt(0).toUpperCase() + tip.category.slice(1)}{" "}
                  • Potential: -{tip.impactScore} kg CO₂
                  {tip.status === "accepted" && " • Accepted"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-xs text-[var(--color-slate)]">
              Set a goal to get personalised tips.
            </p>
          )}
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
      {/* <div className="grid grid-cols-2 gap-4">
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
      </div> */}
      <LogEntryModal
        isOpen={isLogEntryModalOpen}
        onClose={() => setIsLogEntryModalOpen(false)}
        onSuccess={handleEntryAdded}
      />
    </>
  );
}
