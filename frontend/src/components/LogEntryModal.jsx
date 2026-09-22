import { useState } from "react";
import { X } from "lucide-react";

export default function LogEntryModal({ isOpen, onClose, onSave }) {
  const [activeTab, setActiveTab] = useState("Transportation");

  const [transport, setTransport] = useState({
    type: "Car (Gasoline)",
    vehicleClass: "SUV (Mid-size)",
    distance: "42.5",
    unit: "km",
    duration: "35 mins",
    date: "2026-10-24",
    notes: "Weekly office commute via Highway 101.",
  });

  const [energy, setEnergy] = useState({
    source: "Electricity",
    amount: "320",
    unit: "kWh",
    billingPeriod: "Oct 1 - Oct 31",
    provider: "EcoGrid Power",
    renewableMix: true,
    notes: "Any householdappliance upates or extra usage details...",
    date: "2026-10-24",
  });

  const [food, setFood] = useState({
    meal: "Dinner",
    dietProfile: "Plant Based",
    servingSize: "Medium",
    items: ["Vegetables", "Grains"],
    date: "2026-10-24",
    notes: "e.g. organic, locally sourced",
  });

  const [waste, setWaste] = useState({
    category: "Recycling",
    weight: "8.4",
    unit: "kg",
    disposalRoute: "Curbside Pickup",
    disposalDate: "2026-10-24",
    hazardous: false,
    notes: "Corrrugated cardboard boxes and plastic containers from shipping.",
  });

  const [water, setWater] = useState({
    activity: "Laundry Cycle",
    volume: "55",
    unit: "L",
    frequency: "Weekly",
    source: "Municipal",
    date: "2026-10-24",
    notes: "Eco-cold load",
  });

  if (!isOpen) return null;

  const getImpact = () => {
    switch (activeTab) {
      case "Transportation":
        return (parseFloat(transport.distance || 0) * 0.202).toFixed(1);
      case "Energy":
        return (parseFloat(energy.amount || 0) * 0.13).toFixed(1);
      case "Food":
        return food.dietProfile === "Meat-Heavy" ? "4.5" : "1.8";
      case "Waste":
        return waste.category === "Recycling"
          ? "0.0"
          : (parseFloat(waste.weight || 0) * 0.5).toFixed(1);
      case "Water":
        return (parseFloat(water.volume || 0) * 0.007).toFixed(1);
      default:
        return "0.0";
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let payload = { category: activeTab, impact: getImpact() };

    if (activeTab === "Transportation") payload = { ...payload, ...transport };
    if (activeTab === "Energy") payload = { ...payload, ...energy };
    if (activeTab === "Food") payload = { ...payload, ...food };
    if (activeTab === "Waste") payload = { ...payload, ...waste };
    if (activeTab === "Water") payload = { ...payload, ...water };

    onSave(payload);
  };

  const toggleFoodItem = (item) => {
    setFood((prev) => ({
      ...prev,
      items: prev.items.includes(item)
        ? prev.items.filter((i) => i !== item)
        : [...prev.items, item],
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--color-surface)] w-full max-w-xl rounded-2xl p-6 shadow-xl relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[var(--color-slate)]/20 mb-4">
          <h2 className="text-xl font-bold text-[var(--color-primary)]">
            Log Activity
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-gray-100 text-[var(--color-slate)] cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 border-b border-[var(--color-slate)]/10">
          {["Transportation", "Energy", "Food", "Waste", "Water"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeTab === cat
                  ? "bg-[var(--color-eco)] text-white shadow-xs"
                  : "bg-gray-100 text-[var(--color-slate)] hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {activeTab === "Transportation" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--color-slate)]">
                    Transport Type
                  </label>
                  <select
                    value={transport.type}
                    onChange={(e) =>
                      setTransport({ ...transport, type: e.target.value })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  >
                    <option>Car (Gasoline)</option>
                    <option>Electric Vehicle (EV)</option>
                    <option>Public Metro / Rail</option>
                    <option>Bicycle / Walking</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--color-slate)]">
                    Vehicle Class
                  </label>
                  <select
                    value={transport.vehicleClass}
                    onChange={(e) =>
                      setTransport({
                        ...transport,
                        vehicleClass: e.target.value,
                      })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  >
                    <option>SUV (Mid-size)</option>
                    <option>Sedan (Standard)</option>
                    <option>Compact Car</option>
                    <option>Bus / Transit</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[var(--color-slate)]">
                      Distance
                    </label>
                    <div className="flex text-xs bg-gray-100 rounded-md p-0.5">
                      {["km", "mi"].map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() =>
                            setTransport({ ...transport, unit: u })
                          }
                          className={`px-2 py-0.5 rounded cursor-pointer ${transport.unit === u ? "bg-white font-bold shadow-xs" : ""}`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>

                  <input
                    type="number"
                    step="0.1"
                    value={transport.distance}
                    onChange={(e) =>
                      setTransport({ ...transport, distance: e.target.value })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--color-slate)]">
                    Duration (optional)
                  </label>
                  <input
                    type="text"
                    value={transport.duration}
                    onChange={(e) =>
                      setTransport({ ...transport, duration: e.target.value })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--color-slate)]">
                    Date
                  </label>
                  <input
                    type="date"
                    value={transport.date}
                    onChange={(e) =>
                      setTransport({ ...transport, date: e.target.value })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--color-slate)]">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={transport.notes}
                  onChange={(e) =>
                    setTransport({ ...transport, notes: e.target.value })
                  }
                  className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                />
              </div>
            </>
          )}

          {activeTab === "Energy" && (
            <>
              <div className="grid grid-cols-2 gap-4 items-start">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-slate)] mb-1">
                    Energy Source
                  </label>
                  <select
                    value={energy.source}
                    onChange={(e) =>
                      setEnergy({ ...energy, source: e.target.value })
                    }
                    className="w-full border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  >
                    <option>Electricity</option>
                    <option>Natural Gas</option>
                    <option>Heating Oil</option>
                    <option>Solar</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-medium text-[var(--color-slate)]">
                      Usage Amount
                    </label>
                    <span className="text-xs font-semibold text-[var(--color-slate)]">
                      {energy.unit}
                    </span>
                  </div>
                  <input
                    type="number"
                    value={energy.amount}
                    onChange={(e) =>
                      setEnergy({ ...energy, amount: e.target.value })
                    }
                    className="w-full border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 items-start">
                <div>
                  <label className="block text-xs font-medium text-[var(--color-slate)] mb-1">
                    Billing Period
                  </label>
                  <input
                    type="text"
                    value={energy.billingPeriod}
                    onChange={(e) =>
                      setEnergy({ ...energy, billingPeriod: e.target.value })
                    }
                    className="w-full border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[var(--color-slate)] mb-1">
                    Utility Provider (optional)
                  </label>
                  <input
                    type="text"
                    value={energy.provider}
                    onChange={(e) =>
                      setEnergy({ ...energy, provider: e.target.value })
                    }
                    className="w-full border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="renewable"
                  checked={energy.renewableMix}
                  onChange={(e) =>
                    setEnergy({ ...energy, renewableMix: e.target.checked })
                  }
                  className="accent-[var(--color-eco)] h-4 w-4 rounded"
                />
                <label
                  htmlFor="renewable"
                  className="text-xs text-[var(--color-slate)] font-medium cursor-pointer"
                >
                  Renewable Energy Mix (45%)
                </label>
              </div>

              
            </>
          )}

          {activeTab === "Food" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--color-slate)]">
                    Meal
                  </label>
                  <select
                    value={food.meal}
                    onChange={(e) => setFood({ ...food, meal: e.target.value })}
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  >
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                    <option>Snacks</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--color-slate)]">
                    Diet Profile
                  </label>
                  <select
                    value={food.dietProfile}
                    onChange={(e) =>
                      setFood({ ...food, dietProfile: e.target.value })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  >
                    <option>Plant Based</option>
                    <option>Vegetarian</option>
                    <option>Mixed</option>
                    <option>Meat-Heavy</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--color-slate)] mb-1 block">
                  Key Food Items
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Beef",
                    "Chicken",
                    "Fish",
                    "Dairy",
                    "Vegetables",
                    "Grains",
                    "Fruits",
                  ].map((item) => {
                    const isSelected = food.items.includes(item);
                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => toggleFoodItem(item)}
                        className={`text-xs px-3 py-1 rounded-full border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-[var(--color-eco)] text-white border-[var(--color-eco)]"
                            : "border-[var(--color-slate)]/30 text-[var(--color-slate)] hover:bg-gray-50"
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--color-slate)]">
                    Serving Size
                  </label>
                  <select
                    value={food.servingSize}
                    onChange={(e) =>
                      setFood({ ...food, servingSize: e.target.value })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  >
                    <option>Small</option>
                    <option>Medium</option>
                    <option>Large</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--color-slate)]">
                    Date
                  </label>
                  <input
                    type="date"
                    value={food.date}
                    onChange={(e) => setFood({ ...food, date: e.target.value })}
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--color-slate)]">
                  Notes
                </label>
                <textarea
                  rows={2}
                  value={food.notes}
                  onChange={(e) => setFood({ ...food, notes: e.target.value })}
                  className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                />
              </div>
            </>
          )}

          {activeTab === "Waste" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--color-slate)]">
                    Waste Category
                  </label>
                  <select
                    value={waste.category}
                    onChange={(e) =>
                      setWaste({ ...waste, category: e.target.value })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  >
                    <option>Recycling</option>
                    <option>Organic / Food Waste</option>
                    <option>General Landfill</option>
                    <option>Hazardous / E-Waste</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[var(--color-slate)]">
                      Weight Estimate
                    </label>
                    <div className="flex text-xs bg-gray-100 rounded-md p-0.5">
                      {["kg", "lbs"].map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setWaste({ ...waste, unit: u })}
                          className={`px-2 py-0.5 rounded cursor-pointer ${waste.unit === u ? "bg-white font-bold shadow-xs" : ""}`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    value={waste.weight}
                    onChange={(e) =>
                      setWaste({ ...waste, weight: e.target.value })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--color-slate)]">
                    Disposal Route
                  </label>
                  <select
                    value={waste.disposalRoute}
                    onChange={(e) =>
                      setWaste({ ...waste, disposalRoute: e.target.value })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  >
                    <option>Curbside Pickup</option>
                    <option>Drop-off Center</option>
                    <option>Compost Pile</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--color-slate)]">
                    Disposal Date
                  </label>
                  <input
                    type="date"
                    value={waste.disposalDate}
                    onChange={(e) =>
                      setWaste({ ...waste, disposalDate: e.target.value })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hazardous"
                  checked={waste.hazardous}
                  onChange={(e) =>
                    setWaste({ ...waste, hazardous: e.target.checked })
                  }
                  className="accent-[var(--color-eco)] h-4 w-4 rounded"
                />
                <label
                  htmlFor="hazardous"
                  className="text-xs text-[var(--color-slate)] font-medium cursor-pointer"
                >
                  Contains Hazardous Items (Batteries, electronics, or chemical
                  solvents)
                </label>
              </div>
              <div>
                <label className="text-xs font-medium text-[var(--color-slate)]">
                  Item Description / Notes
                </label>
                <textarea
                  rows={2}
                  value={waste.notes}
                  onChange={(e) =>
                    setWaste({ ...waste, notes: e.target.value })
                  }
                  className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                />
              </div>
            </>
          )}

          {activeTab === "Water" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium text-[var(--color-slate)]">
                    Water Activity
                  </label>
                  <select
                    value={water.activity}
                    onChange={(e) =>
                      setWater({ ...water, activity: e.target.value })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  >
                    <option>Laundry Cycle</option>
                    <option>Dishwasher Run</option>
                    <option>Shower / Bath</option>
                    <option>Lawn Watering</option>
                  </select>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-medium text-[var(--color-slate)]">
                      Volume / Load
                    </label>
                    <div className="flex text-xs bg-gray-100 rounded-md p-0.5">
                      {["L", "Gal"].map((u) => (
                        <button
                          key={u}
                          type="button"
                          onClick={() => setWater({ ...water, unit: u })}
                          className={`px-2 py-0.5 rounded cursor-pointer ${water.unit === u ? "bg-white font-bold shadow-xs" : ""}`}
                        >
                          {u}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input
                    type="number"
                    value={water.volume}
                    onChange={(e) =>
                      setWater({ ...water, volume: e.target.value })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-medium text-[var(--color-slate)]">
                    Frequency
                  </label>
                  <select
                    value={water.frequency}
                    onChange={(e) =>
                      setWater({ ...water, frequency: e.target.value })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  >
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--color-slate)]">
                    Water Source
                  </label>
                  <select
                    value={water.source}
                    onChange={(e) =>
                      setWater({ ...water, source: e.target.value })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  >
                    <option>Municipal</option>
                    <option>Well Water</option>
                    <option>Rainwater</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-[var(--color-slate)]">
                    Date
                  </label>
                  <input
                    type="date"
                    value={water.date}
                    onChange={(e) =>
                      setWater({ ...water, date: e.target.value })
                    }
                    className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-medium text-[var(--color-slate)]">
                  Notes (optional)
                </label>
                <textarea
                  rows={2}
                  value={water.notes}
                  onChange={(e) =>
                    setWater({ ...water, notes: e.target.value })
                  }
                  className="w-full mt-1 border border-[var(--color-slate)]/40 rounded-lg p-2 text-sm outline-none"
                />
              </div>
            </>
          )}

          <div className="bg-emerald-50 text-emerald-800 p-3 rounded-xl flex items-center justify-between text-sm mt-4">
            <span>Estimated Impact:</span>
            <span className="font-bold text-base">~{getImpact()} kg CO₂</span>
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-[var(--color-slate)]/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[var(--color-slate)]/40 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--color-eco)] text-white rounded-lg text-sm font-medium cursor-pointer hover:brightness-95"
            >
              Log {activeTab}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
