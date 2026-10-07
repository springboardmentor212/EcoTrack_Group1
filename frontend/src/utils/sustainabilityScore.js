export const calculateSustainabilityScore = (
  entries = [],
  activeGoals = [],
) => {
  const totalKg = entries.reduce((sum, e) => sum + (e.calculatedCO2 || 0), 0);

  const footprintScore = Math.max(
    0,
    Math.min(50, 50 - Math.round(totalKg / 2)),
  );

  const avgGoalProgress = activeGoals.length
    ? activeGoals.reduce((sum, g) => sum + g.percent, 0) / activeGoals.length
    : 0;
  const goalScore = Math.round((avgGoalProgress / 100) * 30);

  const baseActivityScore = Math.min(20, entries.length * 4);

  return Math.min(100, footprintScore + goalScore + baseActivityScore);
};

export const getScoreBadge = (score) => {
  if (score >= 80) return "Champion";
  if (score >= 60) return "Warrior";
  if (score >= 40) return "Starter";
  return "Beginner";
};
