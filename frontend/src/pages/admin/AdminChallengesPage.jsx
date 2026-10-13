import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import ChallengeFormModal from "../../components/ChallengeFormModal";
import { capitalize } from "../../utils/challengeUtils";
import {
  getAdminChallenges,
  createAdminChallenge,
  updateAdminChallenge,
} from "../../services/adminService";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Ended", value: "completed" },
];

const STATUS_STYLES = {
  active: "bg-green-100 text-green-700",
  upcoming: "bg-blue-100 text-blue-700",
  completed: "bg-gray-100 text-gray-600",
};

const STATUS_LABELS = {
  active: "Active",
  upcoming: "Upcoming",
  completed: "Ended",
};

const durationDays = (start, end) =>
  Math.max(1, Math.round((new Date(end) - new Date(start)) / 86400000));

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const loadChallenges = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getAdminChallenges();
      setChallenges(response.data.data.challenges || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Could not load challenges. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadChallenges();
  }, [loadChallenges]);

  const filteredChallenges = useMemo(
    () =>
      selectedFilter === "all"
        ? challenges
        : challenges.filter((c) => c.status === selectedFilter),
    [challenges, selectedFilter],
  );

  const openCreate = () => {
    setEditing(null);
    setFormOpen(true);
  };

  const openEdit = (challenge) => {
    setEditing(challenge);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setEditing(null);
  };

  const handleSave = async (payload) => {
    try {
      if (editing) {
        await updateAdminChallenge(editing._id, payload);
      } else {
        await createAdminChallenge(payload);
      }
    } catch (err) {
      throw new Error(
        err.response?.data?.message || "Could not save the challenge.",
      );
    }

    toast.success(editing ? "Challenge updated." : "Challenge created.");
    closeForm();
    await loadChallenges();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">
            Manage Challenges
          </h1>
          <p className="mt-1 text-sm text-[var(--color-slate)]">
            Create and manage sustainability challenges.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreate}
          className="rounded-lg bg-[var(--color-eco)] px-4 py-2 text-sm font-medium text-white hover:opacity-90"
        >
          + Create Challenge
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        {FILTERS.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setSelectedFilter(filter.value)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              selectedFilter === filter.value
                ? "bg-[var(--color-eco)] text-white"
                : "border border-gray-200 bg-white text-[var(--color-slate)]"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
          <button
            type="button"
            onClick={loadChallenges}
            className="ml-2 font-semibold underline"
          >
            Retry
          </button>
        </div>
      )}

      {loading ? (
        <p className="py-10 text-center text-sm text-[var(--color-slate)]">
          Loading challenges...
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredChallenges.map((challenge) => (
              <article
                key={challenge._id}
                className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h2 className="text-lg font-semibold text-[var(--color-slate)]">
                    {challenge.title}
                  </h2>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[challenge.status]}`}
                  >
                    {STATUS_LABELS[challenge.status] || challenge.status}
                  </span>
                </div>

                <p className="mt-3 text-sm text-[var(--color-muted)]">
                  {challenge.description}
                </p>

                <p className="mt-3 text-xs text-[var(--color-muted)]">
                  {capitalize(challenge.category)} · cap{" "}
                  {challenge.targetMetric} kg CO₂
                </p>

                <div className="mt-4 flex justify-between gap-3 text-sm">
                  <span className="text-[var(--color-muted)]">
                    Duration:{" "}
                    {durationDays(challenge.startDate, challenge.endDate)} days
                  </span>
                  <span className="text-[var(--color-eco)]">
                    {challenge.membersJoined ?? 0} participants
                  </span>
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    type="button"
                    onClick={() => openEdit(challenge)}
                    className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-secondary)] hover:bg-[var(--color-secondary)]/10"
                  >
                    Edit
                  </button>
                </div>
              </article>
            ))}
          </div>

          {filteredChallenges.length === 0 && !error && (
            <p className="py-8 text-center text-[var(--color-muted)]">
              No challenges found for this status.
            </p>
          )}
        </>
      )}

      {formOpen && (
        <ChallengeFormModal
          key={editing?._id || "new"}
          editingChallenge={editing}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
