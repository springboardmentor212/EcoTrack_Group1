import { useNavigate } from "react-router-dom";
import { Search, Download } from "lucide-react";

const logs = [
  {
    id: 1,
    date: "Oct 24 2026",
    category: "Transportation",
    description: "Office commute via public metro rail",
    amount: "0.2 kg C0₂",
    type: "Recurring",
  },
  {
    id: 2,
    date: "Oct 23 2026",
    category: "Electricity",
    description: "Daytime cooling & server consumption",
    amount: "14.5 kg CO₂",
    type: "Manual Log",
  },
  {
    id: 3,
    date: "Oct 22 2026",
    category: "Waste & Recycling",
    description: "Recycled paper and plastic load",
    amount: "0.0 kg CO₂",
    type: "Manual Log",
  },
  {
    id: 4,
    date: "Oct 21 2026",
    category: "Water Consumption",
    description: "Office laundry & dishwashing cycle",
    amount: "1.2 kg CO₂",
    type: "Automated Integration",
  },
];

export default function CarbonTracker() {
  const navigate = useNavigate();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-[var(--color-primary)]">Carbon Log History</h1>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-slate)]"
          />
          <input
            placeholder="Search your sustainability logs..."
            className="pl-9 pr-4 py-2 w-full rounded-lg border border-[var(--color-slate)] text-sm outline-none"
          />
        </div>
        <select className="text-sm border border-[var(--color-slate)] rounded-lg px-3 py-2">
          <option>Category: All</option>
          <option>Transportation</option>
          <option>Electricity</option>
          <option>Waste & Recycling</option>
          <option>Water Consumption</option>
        </select>
        <div className="flex items-center gap-3">
          <select className="text-sm border border-[var(--color-slate)] rounded-lg px-3 py-2">
            <option>Last 30 Days</option>
            <option>Last 7 Days</option>
            <option>This Year</option>
          </select>
          <button className="flex items-center gap-2 text-sm bg-[var(--color-eco)] text-white px-4 py-2 rounded-lg cursor-pointer">
            <Download size={14} /> Export CSV
          </button>
        </div>
      </div>

      <div className="bg-[var(--color-surface)] rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-[var(--color-slate)] border-b border-[var(--color-)]">
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Category</th>
              <th className="px-5 py-3">Activity Description</th>
              <th className="px-5 py-3">Carbon Amount</th>
              <th className="px-5 py-3">Entry Type</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr
                key={log.id}
                onClick={() => navigate(`/carbon-tracker/${log.id}`)}
                className="border-b border-[var(--color-slate)] last:border-0 cursor-pointer hover:bg-[var(--color-background)]"
              >
                <td className="px-5 py-3 text-[var(--color-muted)]">
                  {log.date}
                </td>
                <td className="px-5 py-3 text-[var(--color-muted)]">
                  {log.category}
                </td>
                <td className="px-5 py-3 text-[var(--color-slate)]">
                  {log.description}
                </td>
                <td className="px-5 py-3 font-medium text-[var(--color-primary)]">
                  {log.amount}
                </td>
                <td className="px-5 py-3 text-[var(--color-slate)]">
                  {log.type}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-sm text-[var(--color-slate)]">
        <span>Showing 1-4 of 48 entries</span>
        <div className="flex gap-4">
          <button className="px-3 py-1 border border-[var(--color-slate)] bg-[var(--color-slate)]/10 font-semibold cursor-pointer rounded-lg">
            Previous
          </button>
          <button className="px-3 py-1 border border-[var(--color-slate)] text-sm bg-[var(--color-eco)] text-white font-semibold cursor-pointer rounded-lg">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
