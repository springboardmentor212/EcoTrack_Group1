import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ChallengeCard from "../components/ChallengeCard";
import ChallengeFormModal from "../components/ChallengeFormModal";
import useCurrentUser from "../hooks/useCurrentUser";
import * as challengeService from "../services/challengeService";
import { getDurationLabel } from "../utils/challengeUtils";

const tabs = ["All", "Active", "Upcoming", "Completed"];

const Challenges = () => {
  const navigate = useNavigate();
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joiningId, setJoiningId] = useState(null);

  const { role, loading: userLoading } = useCurrentUser();
  const isAdmin = role === "admin";

  const loadChallenges = async () => {
    try {
      const res = await challengeService.getChallenges();
      setChallenges(res.data.data || []);
      setError("");
    } catch (err) {
      setError(challengeService.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadChallenges();
  }, []);

  const filteredChallenges =
    selectedFilter === "All"
      ? challenges
      : challenges.filter((c) => c.status === selectedFilter.toLowerCase());

  const handleSaveChallenge = async (payload) => {
    if (!isAdmin) return;

    try {
      if (editingChallenge) {
        await challengeService.updateChallenge(editingChallenge._id, payload);
        toast.success("Challenge updated");
      } else {
        await challengeService.createChallenge(payload);
        toast.success("Challenge created");
      }
    } catch (err) {
      throw new Error(challengeService.getErrorMessage(err));
    }

    setIsModalOpen(false);
    setEditingChallenge(null);
    loadChallenges();
  };

  const handleEdit = (challenge) => {
    if (!isAdmin) return;
    setEditingChallenge(challenge);
    setIsModalOpen(true);
  };

  const handleJoin = async (challenge) => {
    setJoiningId(challenge._id);
    try {
      await challengeService.joinChallenge(challenge._id);
      toast.success(`You joined "${challenge.title}"`);
      navigate(`/challenges/${challenge._id}`);
    } catch (err) {
      toast.error(challengeService.getErrorMessage(err));
    } finally {
      setJoiningId(null);
    }
  };

  if (userLoading || loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-[var(--color-muted)]">
          Loading challenges...
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-primary)]">
            Challenges
          </h1>

          <p className="text-sm text-[var(--color-slate)] mt-1">
            Join challenges and track your sustainability progress.
          </p>
        </div>

        {isAdmin && (
          <button
            onClick={() => {
              setEditingChallenge(null);
              setIsModalOpen(true);
            }}
            className="rounded-lg bg-[var(--color-eco)] px-4 py-2 text-sm font-medium text-white cursor-pointer transition-all duration-300 transform hover:shadow-md hover:brightness-95 active:scale-[0.90] antialiased"
          >
            + Create Challenge
          </button>
        )}
      </div>

      {/* Tabs styled identically to Goals */}
      <div className="flex gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedFilter(tab)}
            className={`text-sm px-4 py-1.5 rounded-full cursor-pointer ${
              selectedFilter === tab
                ? "bg-[var(--color-primary)] text-white"
                : "bg-[var(--color-surface)] text-[var(--color-slate)]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {!error && filteredChallenges.length === 0 && (
        <p className="mt-6 text-sm text-[var(--color-muted)]">
          No challenges to show here yet.
        </p>
      )}

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredChallenges.map((challenge) => (
          <ChallengeCard
            key={challenge._id}
            id={challenge._id}
            title={challenge.title}
            description={challenge.description}
            duration={getDurationLabel(challenge)}
            participants={challenge.participantsCount}
            category={challenge.category}
            targetMetric={challenge.targetMetric}
            startDate={challenge.startDate}
            endDate={challenge.endDate}
            status={challenge.status}
            joined={challenge.joined}
            joining={joiningId === challenge._id}
            isAdmin={isAdmin}
            onEdit={() => handleEdit(challenge)}
            onJoin={() => handleJoin(challenge)}
          />
        ))}
      </div>

      {isAdmin && isModalOpen && (
        <ChallengeFormModal
          onClose={() => {
            setIsModalOpen(false);
            setEditingChallenge(null);
          }}
          onSave={handleSaveChallenge}
          editingChallenge={editingChallenge}
        />
      )}
    </div>
  );
};

export default Challenges;