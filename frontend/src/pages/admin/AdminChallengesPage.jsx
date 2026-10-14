
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";

import ChallengeFormModal from "../../components/ChallengeFormModal";
import AdminChallengeCard from "../../components/AdminChallengeCard";
import {
  getAdminChallenges,
  createAdminChallenge,
  updateAdminChallenge,
  endAdminChallenge,
  deleteAdminChallenge,
} from "../../services/adminService";

const FILTERS = [
  { label: "All", value: "all" },
  { label: "Active", value: "active" },
  { label: "Upcoming", value: "upcoming" },
  { label: "Completed", value: "completed" },
];

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [actionInProgress, setActionInProgress] = useState(false);

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
        : challenges.filter(
            (challenge) => challenge.status === selectedFilter,
          ),
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

      toast.success(editing ? "Challenge updated." : "Challenge created.");
      closeForm();
      await loadChallenges();
    } catch (err) {
      const message =
        err.response?.data?.message || "Could not save the challenge.";
      toast.error(message);
      throw new Error(message);
    }
  };

  const handleEnd = async (challenge) => {
    const confirmed = window.confirm(
      `End "${challenge.title}" now? Participants will no longer be able to treat it as active.`,
    );

    if (!confirmed) return;

    setActionInProgress(true);

    try {
      await endAdminChallenge(challenge._id);
      toast.success("Challenge ended successfully.");
      await loadChallenges();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not end the challenge.",
      );
    } finally {
      setActionInProgress(false);
    }
  };

  const handleDelete = async (challenge) => {
    const confirmed = window.confirm(
      `Delete "${challenge.title}" permanently? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setActionInProgress(true);

    try {
      await deleteAdminChallenge(challenge._id);
      toast.success("Challenge deleted successfully.");
      await loadChallenges();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Could not delete the challenge.",
      );
    } finally {
      setActionInProgress(false);
    }
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
          disabled={actionInProgress}
          className="rounded-lg bg-[var(--color-eco)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
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
            className={`cursor-pointer rounded-full px-4 py-1.5 text-sm ${
              selectedFilter === filter.value
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface)] text-[var(--color-slate)]"
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
              <AdminChallengeCard
                key={challenge._id}
                challenge={challenge}
                onEdit={openEdit}
                onEnd={handleEnd}
                onDelete={handleDelete}
              />
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