export const EMISSION_FACTORS = {
  Transportation: 0.202,
  Energy: 0.13,
  Waste: 0.5,
  Water: 0.007,
  Food: 1.8,
};

const MI_TO_KM = 1.60934;
const LBS_TO_KG = 0.453592;
const GAL_TO_L = 3.78541;

export function calculateEmission(
  category,
  value,
  unit,
  wasteIsRecycling = false,
) {
  const val = parseFloat(value);
  if (isNaN(val) || val < 0) return 0;

  switch (category) {
    case "Transportation": {
      const km = unit === "mi" ? val * MI_TO_KM : val;
      return +(km * EMISSION_FACTORS.Transportation).toFixed(1);
    }
    case "Energy":
      return +(val * EMISSION_FACTORS.Energy).toFixed(1);
    case "Waste": {
      if (wasteIsRecycling) return 0;
      const kg = unit === "lbs" ? val * LBS_TO_KG : val;
      return +(kg * EMISSION_FACTORS.Waste).toFixed(1);
    }
    case "Water": {
      const liters = unit === "Gal" ? val * GAL_TO_L : val;
      return +(liters * EMISSION_FACTORS.Water).toFixed(1);
    }
    case "Food":
      return +(val * EMISSION_FACTORS.Food).toFixed(1);
    default:
      return 0;
  }
}
