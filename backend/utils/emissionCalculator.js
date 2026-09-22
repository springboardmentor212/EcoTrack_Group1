const conversionFactors = {
  electricity: {
    unit: "kWh",
    factor: 0.82,
    description: "Electricity consumption"
  },

  petrol: {
    unit: "litre",
    factor: 2.31,
    description: "Petrol consumption"
  },

  diesel: {
    unit: "litre",
    factor: 2.68,
    description: "Diesel consumption"
  },

  lpg: {
    unit: "kg",
    factor: 3.00,
    description: "LPG consumption"
  },

  car: {
    unit: "km",
    factor: 0.21,
    description: "Car travel"
  },

  bus: {
    unit: "km",
    factor: 0.105,
    description: "Bus travel"
  },

  train: {
    unit: "km",
    factor: 0.041,
    description: "Train travel"
  },

  waste: {
    unit: "kg",
    factor: 0.5,
    description: "General waste"
  }
};

function calculateEmission(category, amount) {
  if (!category || typeof category !== "string") {
    throw new Error("Category is required");
  }

  if (typeof amount !== "number" || amount < 0) {
    throw new Error("Amount must be a positive number");
  }

  const selectedCategory = category.toLowerCase().trim();
  const categoryData = conversionFactors[selectedCategory];

  if (!categoryData) {
    throw new Error(`Unsupported category: ${category}`);
  }

  const emission = amount * categoryData.factor;

  return {
    category: selectedCategory,
    amount,
    unit: categoryData.unit,
    conversionFactor: categoryData.factor,
    emission: Number(emission.toFixed(2)),
    emissionUnit: "kg CO2e"
  };
}

function getConversionFactors() {
  return conversionFactors;
}

function getConversionFactor(category) {
  if (!category || typeof category !== "string") {
    throw new Error("Category is required");
  }

  const selectedCategory = category.toLowerCase().trim();
  const categoryData = conversionFactors[selectedCategory];

  if (!categoryData) {
    throw new Error(`Unsupported category: ${category}`);
  }

  return categoryData;
}

module.exports = {
  conversionFactors,
  calculateEmission,
  getConversionFactors,
  getConversionFactor
};