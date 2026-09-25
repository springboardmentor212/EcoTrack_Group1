export function getGoalPercent(goal) {
  if (!goal.target || goal.target <= 0) return 0;
  return Math.round((goal.currentValue / goal.target) * 100);
}

export function getGoalBarWidth(goal) {
  return Math.min(100, getGoalPercent(goal));
}

export function getGoalRemaining(goal) {
  return Number((goal.target - goal.currentValue).toFixed(1));
}

export function getGoalStatus(goal) {
  if (goal.status === "completed") return "Completed";
  if (goal.status === "paused") return "Paused";
  return getGoalPercent(goal) > 100 ? "Over Cap" : "On Track";
}

export function getPeriodLabel(timeframe) {
  if (timeframe === "Daily") return "today";
  if (timeframe === "Weekly") return "this week";
  return "this month";
}

export function formatDeadline(deadline) {
  if (!deadline) return "";
  return new Date(deadline).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
