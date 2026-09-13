import { Search, Bell, Sparkles } from "lucide-react";
import StatCard from "../components/StatCard";
import GoalRow from "../components/GoalRow";
import CategoryRow from "../components/CategoryRow";
import ChallengeRow from "../components/ChallengeRow";
import TipRow from "../components/TipRow";
import LeaderboardRow from "../components/LeaderboardRow";
import ActivityRow from "../components/ActivityRow";

const statCards = [
  {
    label: "Total Carbon Footprint",
    value: "2.4 Tons CO₂",
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
    value: "5 of 7",
    trend: "On Track vs last month",
    trendGood: true,
  },
  {
    label: "Challenge Rank",
    value: "#24 / 1,250",
    trend: "↑ 8 places vs last month",
    trendGood: true,
  },
];

const categories = [
  { color: "#0EA5E9", label: "Transit (35%)", value: "840 kg" },
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
  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statCards.map((card, i) => (
          <StatCard key={i} {...card} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="col-span-2 bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-[var(--color-primary)] mb-1">
            Emission Trend (kg CO₂)
          </h3>
          <p className="text-xs text-[var(--color-slate)] mb-4">
            Mar - Aug (Downward Trajectory)
          </p>
          <div className="h-40 flex items-center justify-center text-[var(--color-slate)] text-sm">
            [Line chart placeholder]
          </div>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-[var(--color-primary)] mb-4">
            Emissions by Category
          </h3>
          <div className="flex items-center justify-center h-24 mb-3">
            2.4t CO₂ total
          </div>
          <ul className="text-xs space-y-1">
            {categories.map((cat, i) => (
              <CategoryRow key={i} {...cat} />
            ))}
          </ul>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-[var(--color-primary)]">
              Sustainability Goals
            </h3>
            <span className="text-xs bg-[var(--color-ecoo)]/10 text-[var(--color-eco)] px-2 py-1 rounded-full">
              In Progress
            </span>
          </div>
          {goals.map((goal, i) => (
            <GoalRow key={i} {...goal} />
          ))}
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
    </>
  );
}
