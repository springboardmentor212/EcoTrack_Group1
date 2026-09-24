import { useEffect } from "react";
import { X } from "lucide-react";

export default function EmissionBreakdownModal({ entry, onClose }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] flex flex-col my-auto overflow-hidden border border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Entry Details</h2>
            <p className="text-xs text-gray-500 mt-0.5">
              {entry.description || entry.category} •{" "}
              {new Date(entry.date).toLocaleDateString()}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4 text-sm overflow-y-auto flex-1">
          <div className="bg-teal-50/60 border border-teal-100 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-teal-700">
                Calculated Emission
              </span>
              <div className="text-2xl font-extrabold text-teal-900 mt-0.5">
                {entry.calculatedCO2} kg CO₂
              </div>
            </div>
            <div className="text-right text-xs text-teal-800">
              <span className="font-semibold block">{entry.category}</span>
              <span className="text-teal-600">
                {entry.value} {entry.unit}
              </span>
            </div>
          </div>

          {entry.value > 0 && (
            <div className="space-y-1.5">
              <h3 className="font-semibold text-gray-800 text-xs uppercase tracking-wide">
                How This Was Calculated
              </h3>
              <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-600 border border-gray-200/60">
                Amount × Emission Factor = Total Emissions
                <div className="text-gray-900 font-semibold mt-1">
                  {entry.value} {entry.unit} ×{" "}
                  {(entry.calculatedCO2 / entry.value).toFixed(3)} kg CO₂/
                  {entry.unit} = {entry.calculatedCO2} kg CO₂
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-2 bg-gray-50 rounded-lg p-3 border border-gray-200/60 text-xs">
            <div>
              <span className="text-gray-500 block">Category</span>
              <span className="font-medium text-gray-800">
                {entry.category}
              </span>
            </div>
            <div>
              <span className="text-gray-500 block">Logged Amount</span>
              <span className="font-medium text-gray-800">
                {entry.value} {entry.unit}
              </span>
            </div>
            <div className="col-span-2 mt-1 pt-1 border-t border-gray-200/60">
              <span className="text-gray-500">Notes: </span>
              <span className="font-medium text-gray-700">
                {entry.description || "—"}
              </span>
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
