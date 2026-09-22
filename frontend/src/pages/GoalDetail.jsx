import { useState } from "react";
import { useParams } from "react-router-dom";
import GoalModal from "../components/GoalModal";

const milestones = [
  { label: "Install Smart Power Monitors", done: true },
  { label: "Switch all bulbs to high efficiency LED", done: true },
  { label: "Reduce background vampire load by 15%", done: false },
  { label: "Source 50% power from community solar", done: false },
];

export default function GoalDetail() {
  const [isEditModalOpen, setIsEditModalOpen]=useState(false);
  const { id } = useParams();

  return (
    <div>
      <p className="text-xs text-[var(--color-slate)] mb-1">
        Goals / Goal Detail
      </p>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">
            Reduce Household Energy Waste
          </h1>
          <p className="text-sm text-[var(--color-slate)] mt-1">
            Targeting a 30% aggregate drop in household power footprint through
            smart automation.
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={()=> setIsEditModalOpen(true)} className="px-4 py-2 text-sm bg-[var(--color-eco)] text-white rounded-lg cursor-pointer transition-all duration-300 transform hover:shadow-md hover:brightness-95 active:scale-[0.90] antialiased">
            Edit Goal
          </button>
          {/* <button className="px-4 py-2 text-sm border border-red-300 text-red-500 rounded-lg font-bold cursor-pointer">
            Archive
          </button> */}
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-[var(--color-slate)]">Current Value</p>
          <p className="text-xl font-bold text-[var(--color-primary)]">
            78 kWh
          </p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-[var(--color-slate)]">Target Value</p>
          <p className="text-xl font-bold text-[var(--color-primary)]">
            50 kWh
          </p>
        </div>
        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <p className="text-xs text-[var(--color-slate)]">
            Progress · Deadline: Dec 15, 2026
          </p>
          <p className="text-xl font-bold text-[var(--color-eco)]">65%</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-[var(--color-primary)] mb-4">Carbon Emissions Over Time</h3>
          <div className="h-48 flex items-center justify-center text-sm text-[var(--color-slate)]">
            [Line chart palceholder]
          </div>
        </div>

        <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
            <h3 className="font-semibold text-[var(--color-primary)] mb-4">Goal Milestones</h3>
            <ul className="space-y-2 mb-6">
                {milestones.map((m, i) => (
                    <li  key={i} className="flex items-center gap-2 text-sm">
                        <span
                        className={`h-4 w-4 rounded-full flex-shrink-0 ${
                            m.done ? "bg-[var(--color-eco)]" : "border border-[var(--color-slate)]"
                        }`}
                        />
                        <span className={m.done ? "text-[var(--color-muted)]" : "text-[var(--color-slate)]"}></span>
                        {m.label}
                        <span/>
                    </li>
                ))}
            </ul>

            <h3 className="font-semibold text-[var(--color-primary)] mb-2">AI Optimization Tips</h3>
            <p className="text-xs text-[var(--color-slate)]">
                Switching your appliance standby mode to Eco Save automatically halves idle power consumption without active management.
            </p>
        </div>
      </div>

      <GoalModal
      isOpen={isEditModalOpen}
      onClose={()=>setIsEditModalOpen(false)}
      editGoal={{title: "Reduce Commute Carbon", targetValue: "80.00"}}
      onSave={(updated)=> {
        console.log("Goal updated:", updated);
        setIsEditModalOpen(false);
      }}
      />
    </div>
  );
}
