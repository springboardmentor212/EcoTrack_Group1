import { Sparkles, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import StatCard from "../components/StatCard";
import GoalRow from "../components/GoalRow";
import CategoryRow from "../components/CategoryRow";
import ChallengeRow from "../components/ChallengeRow";
import LeaderboardRow from "../components/LeaderboardRow";
import ActivityRow from "../components/ActivityRow";
import EmissionTrendChart from "../components/EmissionTrendChart";
import LogEntryModal from "../components/LogEntryModal";
import { searchCarbonEntries } from "../services/carbonService";
import { api } from "../services/ecoApi";
import * as goalService from "../services/goalService";
import * as challengeService from "../services/challengeService";
import * as leaderboardService from "../services/leaderboardService";
import { getGoalBarWidth, getGoalRemaining } from "../utils/goalStatus";
import {
  calculateSustainabilityScore,
  getScoreBadge,
} from "../utils/sustainabilityScore";
import { SCORE_REFRESH_EVENT } from "../hooks/useSustainabilityScore";

const DAY_MS = 24 * 60 * 60 * 1000;

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

const toDateStr = (d) => d.toISOString().slice(0, 10);

const daysAgoLabel = (value) => {
  const d = new Date(value);
  d.setHours(0, 0, 0, 0);
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  const diff = Math.round((t - d) / DAY_MS);
  if (diff <= 0) return "Today";
  if (diff === 1) return "Yesterday";
  return `${diff} days ago`;
};

export default function UserDashboard() {
  const navigate = useNavigate();

  const [totalCO2, setTotalCO2] = useState(null);
  const [prevTotal, setPrevTotal] = useState(0);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [isLogEntryModalOpen, setIsLogEntryModalOpen] = useState(false);
  const [dashboardGoals, setDashboardGoals] = useState([]);
  const [goalsSummary, setGoalsSummary] = useState({
    active: 0,
    total: 0,
    over: 0,
  });
  const [goalAlerts, setGoalAlerts] = useState([]);
  const [recentEntries, setRecentEntries] = useState([]);
  const [scoreGoals, setScoreGoals] = useState([]);
  const [myChallenges, setMyChallenges] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [tips, setTips] = useState([]);
  const [tipsLoading, setTipsLoading] = useState(true);

  const fetchSummary = async () => {
    const to = new Date();
    const from = new Date(to.getTime() - 30 * DAY_MS);
    const prevTo = new Date(from.getTime() - DAY_MS);
    const prevFrom = new Date(prevTo.getTime() - 30 * DAY_MS);

    try {
      const [res, prevRes] = await Promise.all([
        searchCarbonEntries({ from: toDateStr(from), to: toDateStr(to) }),
        searchCarbonEntries({
          from: toDateStr(prevFrom),
          to: toDateStr(prevTo),
        }).catch(() => null),
      ]);

      const prevEntries = prevRes?.data?.carbonEntries || [];
      setPrevTotal(
        prevEntries.reduce((sum, e) => sum + (e.calculatedCO2 || 0), 0),
      );

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
      setPrevTotal(0);
      setTotalCO2(null);
      setCategoryBreakdown([]);
    }
  };

  const fetchGoalsWidget = async () => {
    try {
      const res = await goalService.getGoals();
      const allGoals = res.data.goals || [];

      const shown = allGoals
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
      setDashboardGoals(shown);

      const activeGoals = allGoals.filter(
        (g) => g.status !== "completed" && g.status !== "paused",
      );

      setGoalsSummary({
        active: activeGoals.length,
        total: allGoals.length,
        over: activeGoals.filter((g) => getGoalRemaining(g) < 0).length,
      });

      setScoreGoals(activeGoals.map((g) => ({ percent: getGoalBarWidth(g) })));

      setGoalAlerts(
        activeGoals.flatMap((g) => {
          const remaining = getGoalRemaining(g);
          const pct = getGoalBarWidth(g);
          if (remaining < 0) {
            return [
              {
                text: `${g.title} is ${Math.abs(remaining)} kg over its cap`,
                time: "Goal alert",
              },
            ];
          }
          if (pct >= 80) {
            return [
              {
                text: `${g.title} has used ${pct}% of its cap`,
                time: "Goal reminder",
              },
            ];
          }
          return [];
        }),
      );
    } catch (err) {
      setDashboardGoals([]);
      setScoreGoals([]);
      setGoalAlerts([]);
      setGoalsSummary({ active: 0, total: 0, over: 0 });
    }
  };

  const fetchChallengesWidget = async () => {
    try {
      const res = await challengeService.getMyChallenges();
      setMyChallenges(res.data.data || []);
    } catch (err) {
      setMyChallenges([]);
    }
  };

  const fetchLeaderboardWidget = async () => {
    try {
      const res = await leaderboardService.getLeaderboard({ limit: 5 });
      const rows = res.data.data || [];
      const me = res.data.me;

      const list = rows.map((r) => ({
        rank: `#${r.rank}`,
        name: r.name,
        tag: r.level,
        pts: `${r.ecoScore} / 100`,
        highlight: r.isMe,
      }));

      if (me && !rows.some((r) => r.isMe)) {
        list.push({
          rank: `#${me.rank}`,
          name: "You",
          tag: me.level,
          pts: `${me.ecoScore} / 100`,
          highlight: true,
        });
      }

      setTopUsers(list);
    } catch (err) {
      setTopUsers([]);
    }
  };

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
    fetchSummary();
    fetchGoalsWidget();
    fetchChallengesWidget();
    fetchLeaderboardWidget();
    fetchTips();
  }, []);

  const handleEntryAdded = () => {
    fetchSummary();
    fetchGoalsWidget();
    fetchChallengesWidget();
    fetchLeaderboardWidget();
    window.dispatchEvent(new Event(SCORE_REFRESH_EVENT));
  };

  const activeChallenges = myChallenges.filter((c) => c.status === "active");

  const challengeRows = activeChallenges.slice(0, 3).map((c) => ({
    label: c.title,
    note: `${c.daysLeft} ${c.daysLeft === 1 ? "day" : "days"} left • ${c.participantsCount} active`,
  }));

  const bestRanked = activeChallenges
    .filter((c) => c.rank)
    .sort((a, b) => a.rank - b.rank)[0];

  const hasScoreData = recentEntries.length > 0;
  const sustainabilityScore = calculateSustainabilityScore(
    recentEntries,
    scoreGoals,
  );

  const scoreValue = (
    <>
      {hasScoreData ? sustainabilityScore : "—"}
      <span className="ml-1 text-base font-normal text-[var(--color-slate)]">
        / 100
      </span>
    </>
  );

  let footprintTrend = "No entries in the last 30 days";
  let footprintGood = true;
  if (totalCO2 !== null) {
    if (!prevTotal) {
      footprintTrend = "No data for the previous 30 days";
    } else {
      const change = Math.round(((totalCO2 - prevTotal) / prevTotal) * 100);
      if (change === 0) {
        footprintTrend = "Same as the previous 30 days";
      } else {
        footprintTrend = `${change < 0 ? "↓" : "↑"} ${Math.abs(change)}% vs previous 30 days`;
        footprintGood = change < 0;
      }
    }
  }

  const goalsTrend =
    goalsSummary.total === 0
      ? "No goals yet"
      : goalsSummary.over > 0
        ? `${goalsSummary.over} over cap`
        : "All on track";

  const statCards = [
    {
      label: "Total Carbon Footprint",
      value:
        totalCO2 !== null
          ? totalCO2 >= 1000
            ? `${(totalCO2 / 1000).toFixed(2)} Tons CO₂`
            : `${totalCO2.toFixed(1)} kg CO₂`
          : "0 kg CO₂",
      trend: footprintTrend,
      trendGood: footprintGood,
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
      trend: goalsTrend,
      trendGood: goalsSummary.over === 0,
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

  const challengeAlerts = activeChallenges
    .filter((c) => c.daysLeft <= 3)
    .map((c) => ({
      text: `${c.title} ends in ${c.daysLeft} ${c.daysLeft === 1 ? "day" : "days"}`,
      time: "Challenge",
    }));

  const alerts = [...goalAlerts, ...challengeAlerts].slice(0, 4);

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
                  {capitalize(tip.category)} • Potential: -{tip.impactScore} kg
                  CO₂
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
          {topUsers.length ? (
            topUsers.map((entry, i) => <LeaderboardRow key={i} {...entry} />)
          ) : (
            <p className="text-xs text-[var(--color-slate)]">
              No rankings yet. Log an entry to appear here.
            </p>
          )}
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
