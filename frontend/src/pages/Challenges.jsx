import { useState } from "react";
import ChallengeCard from "../components/ChallengeCard";
import ChallengeFilter from "../components/ChallengeFilter";
import ChallengeFormModal from "../components/ChallengeFormModal";
import useCurrentUser from "../hooks/useCurrentUser";

const Challenges = () => {
const [selectedFilter, setSelectedFilter] = useState("All");
const [isModalOpen, setIsModalOpen] = useState(false);
const [editingChallenge, setEditingChallenge] = useState(null);


const { role, loading } = useCurrentUser();
const isAdmin = role === "admin";

const [challenges, setChallenges] = useState([
    {
        id: 1,
        title: "Zero Waste Week",
        description:
            "Reduce your daily waste and follow sustainable habits.",
        duration: "7 days",
        participants: 24,
        status: "Active",
    },
    {
        id: 2,
        title: "Green Transport",
        description:
            "Use eco-friendly transportation methods to reduce emissions.",
        duration: "14 days",
        participants: 18,
        status: "Active",
    },
    {
        id: 3,
        title: "Save Energy",
        description:
            "Reduce electricity consumption and build energy-saving habits.",
        duration: "10 days",
        participants: 31,
        status: "Completed",
    },
    {
        id: 4,
        title: "Plastic Free Challenge",
        description:
            "Avoid single-use plastics and choose reusable alternatives.",
        duration: "7 days",
        participants: 42,
        status: "Completed",
    },
]);

const filteredChallenges =
    selectedFilter === "All"
        ? challenges
        : challenges.filter(
              (challenge) => challenge.status === selectedFilter
          );

const handleSaveChallenge = (challengeData) => {
    if (!isAdmin) return;

    if (editingChallenge) {
        setChallenges((previousChallenges) =>
            previousChallenges.map((challenge) =>
                challenge.id === editingChallenge.id
                    ? {
                          ...challenge,
                          ...challengeData,
                          id: challenge.id,
                      }
                    : challenge
            )
        );

        setEditingChallenge(null);
    } else {
        const newChallenge = {
            ...challengeData,
            id: Date.now(),
            participants: 0,
            status: "Active",
        };

        setChallenges((previousChallenges) => [
            ...previousChallenges,
            newChallenge,
        ]);
    }

    setIsModalOpen(false);
};

const handleEdit = (challenge) => {
    if (!isAdmin) return;

    setEditingChallenge(challenge);
    setIsModalOpen(true);
};

if (loading) {
    return (
        <div className="p-6">
            <p className="text-sm text-[var(--color-muted)]">
                Loading challenges...
            </p>
        </div>
    );
}

return (
    <div className="p-6">
        <div className="flex items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl font-bold text-[var(--color-slate)]">
                    Challenges
                </h1>

                <p className="mt-2 text-[var(--color-muted)]">
                    Join challenges and track your sustainability progress.
                </p>
            </div>

            {isAdmin && (
                <button
                    type="button"
                    onClick={() => {
                        setEditingChallenge(null);
                        setIsModalOpen(true);
                    }}
                    className="rounded-lg bg-[var(--color-eco)] px-4 py-2 text-sm font-medium text-white"
                >
                    + Create Challenge
                </button>
            )}
        </div>

        <ChallengeFilter
            selectedFilter={selectedFilter}
            onFilterChange={setSelectedFilter}
        />

        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filteredChallenges.map((challenge) => (
                <ChallengeCard
                    key={challenge.id}
                    title={challenge.title}
                    description={challenge.description}
                    duration={challenge.duration}
                    participants={challenge.participants}
                    status={challenge.status}
                    isAdmin={isAdmin}
                    onEdit={() => handleEdit(challenge)}
                />
            ))}
        </div>

        {filteredChallenges.length === 0 && (
            <p className="mt-6 text-sm text-[var(--color-muted)]">
                No challenges found for this filter.
            </p>
        )}

        {isAdmin && (
            <ChallengeFormModal
                key={editingChallenge ? editingChallenge.id : "new"}
                isOpen={isModalOpen}
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
