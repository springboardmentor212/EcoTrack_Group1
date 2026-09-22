import React, { useEffect } from "react";
import { X, Lightbulb, TrendingDown, CheckCircle2 } from "lucide-react";

export default function EmissionBreakdownModal({ entry, onClose }) {
    useEffect(()=> {
        document.body.style.overflow="hidden";
        return () => {
            document.body.style.overflow="unset";
        };
    }, []);
  if (!entry) return null;

  const distance = entry.distance || "42.5 km";
  const calculatedOutput = entry.amount || "8.6 kg CO₂";
  const factorValue = entry.factor || "0.202 kg CO₂ / km";
  const sourceAgency = entry.source || "EPA 2025 Database";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col my-auto overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              Emission Breakdown
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {entry.description || "Car Commute"} • {entry.date}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5 text-sm overflow-y-auto flex-1">
          <div className="bg-teal-50/60 border border-teal-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                Calculated Output
              </span>
              <div className="text-2xl font-extrabold text-teal-900 mt-0.5">
                {calculatedOutput}
              </div>
            </div>
            <div className="text-right text-xs text-teal-800">
              <span className="font-semibold block">
                {entry.category || "Transportation"}
              </span>
              <span className="text-teal-600">
                Distance Traveled: {distance}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-semibold text-gray-800 text-xs uppercase tracking-wide">
              Calculation Method
            </h3>
            <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-600 border border-gray-200/60">
              Distance × Emission Factor = Total Emissions
              <div className="text-gray-900 font-semibold mt-1">
                {distance} × {factorValue} = {calculatedOutput}
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-semibold text-gray-800 text-xs uppercase tracking-wide">
              Emission Factors Used
            </h3>
            <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200/60 text-xs">
              <div>
                <span className="text-gray-500 block">Vehicle Type</span>
                <span className="font-medium text-gray-800">Sedan (Gasoline)</span>
              </div>
              <div>
                <span className="text-gray-500 block">Factor Value</span>
                <span className="font-medium text-gray-800">{factorValue}</span>
              </div>
              <div className="col-span-2 mt-1 pt-1 border-t border-gray-200/60">
                <span className="text-gray-500">Source Agency: </span>
                <span className="font-medium text-gray-700">{sourceAgency}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <h3 className="font-semibold text-gray-800 text-xs uppercase tracking-wide">
              Benchmark Comparisons
            </h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-emerald-200 bg-emerald-50/50 text-emerald-800">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <div>
                  <span className="block text-[10px] text-emerald-600 font-medium">vs Regional Average</span>
                  <span className="font-bold">15% Below Avg</span>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2.5 rounded-lg border border-teal-200 bg-teal-50/50 text-teal-800">
                <TrendingDown size={16} className="text-teal-600 shrink-0" />
                <div>
                  <span className="block text-[10px] text-teal-600 font-medium">vs Last Month</span>
                  <span className="font-bold">-12% Decrease</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200/70 rounded-xl p-3.5 flex items-start gap-3 text-xs text-amber-900">
            <Lightbulb size={18} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block mb-0.5 text-amber-950">Eco Suggestion</span>
              Carpooling on Highway 101 or taking public transit cuts this trip's footprint by up to 60%.
            </div>
          </div>
        </div>

        <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
