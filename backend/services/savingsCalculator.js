const DEFAULT_ACTION_SAVINGS_KG = {
  carpool_commute: 120,
  switch_led_bulbs: 75,
  shorter_showers: 15,
  meatless_day: 25,
  reduce_single_use_plastic: 10,
};

function evaluateImpact(currentUsage, capAmount, estimatedSavingsKg) {
  const projectedUsage = Math.max(0, currentUsage - estimatedSavingsKg);
  const bringsUnderCap = capAmount > 0 ? projectedUsage <= capAmount : true;
  const percentOfCapAfter =
    capAmount > 0 ? Math.round((projectedUsage / capAmount) * 100) : 0;

  return { projectedUsage, bringsUnderCap, percentOfCapAfter };
}

function resolveActionSavings(actionKey, aiProvidedSavingsKg) {
  if (typeof aiProvidedSavingsKg === "number" && aiProvidedSavingsKg > 0) {
    return aiProvidedSavingsKg;
  }
  return DEFAULT_ACTION_SAVINGS_KG[actionKey] || 0;
}

module.exports = {
  DEFAULT_ACTION_SAVINGS_KG,
  evaluateImpact,
  resolveActionSavings,
};
