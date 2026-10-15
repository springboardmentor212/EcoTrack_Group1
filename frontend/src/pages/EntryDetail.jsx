import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import ConfirmModal from "../components/ConfirmModal";
import {
  getCarbonEntry,
  updateCarbonEntry,
  deleteCarbonEntry,
} from "../services/carbonService";
import {
  calculateEmission,
  EMISSION_FACTORS,
} from "../utils/emissionCalculator";

export default function EntryDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEntry = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await getCarbonEntry(id);
        const entry = res.data.carbonEntry;
        setForm({
          date: new Date(entry.date).toISOString().slice(0, 10),
          category: entry.category,
          description: entry.description || "",
          value: entry.value,
          unit: entry.unit,
          calculatedCO2: entry.calculatedCO2,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Couldn't load this entry.");
      } finally {
        setLoading(false);
      }
    };
    fetchEntry();
  }, [id]);

  const handleChange = (field) => (e) => {
    const newValue = e.target.value;
    setForm((prev) => {
      const updated = { ...prev, [field]: newValue };

      if (field === "category" || field === "value" || field === "unit") {
        updated.calculatedCO2 = calculateEmission(
          updated.category,
          updated.value,
          updated.unit,
        );
      }
      return updated;
    });
  };

  const handleSave = async () => {
    const parsedValue = parseFloat(form.value);
    if (isNaN(parsedValue) || parsedValue < 0) {
      setError("Quantity must be a valid, non-negative number.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const res = await updateCarbonEntry(id, {
        date: form.date,
        category: form.category,
        description: form.description,
        value: parsedValue,
        unit: form.unit,
        calculatedCO2: parseFloat(form.calculatedCO2) || 0,
      });

      if (res.data?.carbonEntry) {
        setForm({
          date: new Date(res.data.carbonEntry.date).toISOString().slice(0, 10),
          category: res.data.carbonEntry.category,
          description: res.data.carbonEntry.description || "",
          value: res.data.carbonEntry.value,
          unit: res.data.carbonEntry.unit,
          calculatedCO2: res.data.carbonEntry.calculatedCO2,
        });
      }

      navigate("/carbon-tracker");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save changes.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await deleteCarbonEntry(id);
      navigate("/carbon-tracker");
    } catch (err) {
      setShowDeleteConfirm(false);
      setError(err.response?.data?.message || "Couldn't delete this entry.");
      setDeleting(false);
    }
  };

  if (loading) {
    return <p className="text-sm text-[var(--color-slate)]">Loading...</p>;
  }

  if (!form) {
    return (
      <p className="text-sm text-red-600">{error || "Entry not found."}</p>
    );
  }

  return (
    <div>
      <p className="text-xs text-[var(--color-slate)] mb-1">
        Carbon Tracker / Log Entry Details
      </p>
      <h1 className="text-2xl font-bold text-[var(--color-primary)] mb-6">
        Edit Activity Log
      </h1>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-[var(--color-surface)] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--color-slate)]">
                Date of Activity
              </label>
              <input
                type="date"
                value={form.date}
                onChange={handleChange("date")}
                className="w-full mt-1 border border-[var(--color-slate)] rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--color-slate)]">
                Category
              </label>
              <select
                value={form.category}
                onChange={handleChange("category")}
                className="w-full mt-1 border border-[var(--color-slate)] rounded-lg px-3 py-2 text-sm"
              >
                <option>Transportation</option>
                <option>Energy</option>
                <option>Food</option>
                <option>Waste</option>
                <option>Water</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-[var(--color-slate)]">
              Activity Description
            </label>
            <input
              value={form.description}
              onChange={handleChange("description")}
              className="w-full mt-1 border border-[var(--color-slate)] rounded-lg px-3 py-2 text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-[var(--color-slate)]">
                Quantity
              </label>
              <input
                type="number"
                step="0.1"
                value={form.value}
                onChange={handleChange("value")}
                className="w-full mt-1 border border-[var(--color-slate)] rounded-lg px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="text-xs text-[var(--color-slate)]">Unit</label>
              <input
                value={form.unit}
                onChange={handleChange("unit")}
                className="w-full mt-1 border border-[var(--color-slate)] rounded-lg px-3 py-2 text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2">
              {error}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <span className="text-sm text-[var(--color-slate)]">
              Calculated Emission (kg CO₂):{" "}
              <span className="ml-1 font-semibold text-[var(--color-eco)]">
                {form.calculatedCO2}
              </span>
            </span>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(true)}
                disabled={saving}
                className="flex items-center gap-1.5 px-4 py-2 text-sm text-red-600 border border-red-300 rounded-lg cursor-pointer transition-all duration-300 hover:bg-red-50 active:scale-[0.90] disabled:opacity-50"
              >
                <Trash2 size={14} /> Delete Entry
              </button>
              <button
                onClick={() => navigate(-1)}
                disabled={saving}
                className="px-4 py-2 text-sm border border-[var(--color-slate)] rounded-lg disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="px-4 py-2 text-sm bg-[var(--color-eco)] text-white rounded-lg cursor-pointer transition-all duration-300 transform hover:shadow-md hover:brightness-95 active:scale-[0.90] disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>
      </div>
      <ConfirmModal
        isOpen={showDeleteConfirm}
        title="Delete this entry?"
        message="This will remove this log entry from your history. This can't be undone."
        confirmText="Delete"
        onConfirm={handleDelete}
        onClose={() => setShowDeleteConfirm(false)}
        isLoading={deleting}
        danger
      />
    </div>
  );
}
