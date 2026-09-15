import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";

export default function EntryDetail() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        date: "2026-10-24",
        category: "Transportation",
        activityType: "EV Commute (Standard Mid size Sedan)",
        quantity: 45,
        notes: "Standard office commute route. Clean energy grid source for EV charging overnight.",
    });

    const handleChange = (field) => (e) =>
        setForm((prev) => ({...prev, [field]: e.target.value }));

    return (
        <div>
            <p className="text-xs text-[var(--color-slate)] mb-1">Carbon Tracker / Log Entry Details</p>
            <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-6">Edit Activity Log</h1>

            <div className="grid grid-cols-3 gap-6">
                <div className="col-span-2 bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-[var(--color-slate)]">Date of Activity</label>
                            <input
                            type="date"
                            value={form.date}
                            onChange={handleChange("date")}
                            className="w-full mt-1 border border-[var(--color-slate)] rounded-lg px-3 py-2 text=sm"
                            />
                        </div>
                        <div>
                            <label className="text-xs text-[var(--color-slate)]">Category</label>
                            <select
                            value={form.category}
                            onChange={handleChange("category")}
                            className="w-full mt-1 border border-[var(--color-slate)] rounded-lg px-3 py-2 text-sm"
                            >
                                <option>Transportation</option>
                                <option>Electricity</option>
                                <option>Waste & Recycling</option>
                                <option>Water Consumption</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs text-[var(--color-slate)]">Specific Activity Type</label>
                        <input
                        value={form.activityType}
                        onChange={handleChange("activityType")}
                        className="w-full mt-1 border border-[var(--color-slate)] rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-[var(--color-slate)]">Quantity / Distance (km)</label>
                        <input
                        type="number"
                        value={form.quantity}
                        onChange={handleChange("quantity")}
                        className="w-full mt-1 border border-[var(--color-slate)] rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs text-[var(--color-slate)]">Additional Notes</label>
                        <textarea
                        value={form.notes}
                        onChange={handleChange("notes")}
                        rows={3}
                        className="w-full mt-1 border border-[var(--color-slate)] rounded-lg px-3 py-2 text-sm"
                        />
                    </div>

                    <div className="flex items-center justify-between pt-2">
                        <span className="text-sm text-[var(--color-slate)]">
                            Calculated Emission:{" "}
                            <span className="font-semibold text-[var(--color-eco)]">0.2 kg CO₂ equivalent</span>
                        </span>
                        <div className="flex gap-3">
                            <button onClick={() => navigate(-1)} className="px-4 py-2 text-sm border border-[var(--color-slate)] rounded-lg">
                                Cancel
                            </button>
                            <button className="px-4 py-2 text-sm bg-[var(--color-eco)] text-white rounded-lg cursor-pointer  transition-all duration-300 transform hover:shadow-md hover:brightness-95 active:scale-[0.90]">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>

                {/* <div className="bg-[var(--color-surface)] rounded-2xl p-5 shadow-sm">
                    <h3 className="font-semibold text-[var(--color-primary)] mb-3">EcoTrack AI Assistant</h3>
                    <p className="text-xs text-[var(--color-slate)] mb-3">
                        Based on your frequent commute patterns on this route:
                    </p>
                    <div className="mb-3">
                        <p className="text-sm font-medium tetx-[var(--color-muted)]">Potential Savings</p>
                        <p className="text-xs text-[var(--color-slate)] mt-1">
                            Shifting your travel to 10:00 AM leverages off-peak grid periods, reducing indirect power grid carbon impact.
                        </p>
                    </div>
                    <div>
                        <p className="tetx-sm font-medium text-[var(--color-muted)]">Alternative Match</p>
                        <p className="text-xs text-[var(--color-slate)] mt-1">
                            Taking the electric light rail on Tuesdays and Thursdays could cut this commute's footprint by ~1.8 kg CO₂/week.
                        </p>
                    </div>
                </div> */}
            </div>
        </div>
    );
}