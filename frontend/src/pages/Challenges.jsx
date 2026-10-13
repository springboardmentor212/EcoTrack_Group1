
import { useEffect, useState } from "react";
import ChallengeCard from "../components/ChallengeCard";
import ChallengeFilter from "../components/ChallengeFilter";
import ChallengeFormModal from "../components/ChallengeFormModal";
import useCurrentUser from "../hooks/useCurrentUser";
import api from "../services/api";

const getChallengeList = (response) => {
  const body = response?.data;

  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.data)) return body.data;
  if (Array.isArray(body?.challenges)) return body.challenges;
  if (Array.isArray(body?.data?.challenges)) {
    return body.data.challenges;
  }

  return [];
};

const getChallengeId = (challenge) =>
  challenge?._id || challenge?.id;

const getChallengeStatus = (challenge) =>
  String(challenge?.status || "").trim().toLowerCase();

const getValidDate = (value) => {
  if (!value) return null;

  const date = new Date(value);

  return Number.isNaN(date.getTime()) ? null : date;
};

const Challenges = () => {
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingChallenge, setEditingChallenge] = useState(null);
  const [challenges, setChallenges] = useState([]);
  const [loadingChallenges, setLoadingChallenges] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const { role, loading: userLoading } = useCurrentUser();

  const normalizedRole = String(role || "").trim().toLowerCase();
  const isAdmin =
    normalizedRole === "admin" ||
    normalizedRole === "administrator";

  const fetchChallenges = async (showLoader = false) => {
    if (showLoader) {
      setLoadingChallenges(true);
    }

    setFetchError("");

    try {
      const response = await api.get("/challenges");
      setChallenges(getChallengeList(response));
    } catch (error) {
      console.error("Failed to fetch challenges:", error);

      setFetchError(
        error.response?.data?.message ||
          "Unable to load challenges. Check the backend server and API URL."
      );
    } finally {
      setLoadingChallenges(false);
    }
  };

  useEffect(() => {
    let cancelled = false;

    const loadChallenges = async () => {
      try {
        const response = await api.get("/challenges");

        if (!cancelled) {
          setChallenges(getChallengeList(response));
          setFetchError("");
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch challenges:", error);

          setFetchError(
            error.response?.data?.message ||
              "Unable to load challenges. Check the backend server and API URL."
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingChallenges(false);
        }
      }
    };

    loadChallenges();

    return () => {
      cancelled = true;
    };
  }, []);

  // Task 43: Filter challenges by status and dates.
  const filteredChallenges = challenges.filter((challenge) => {
    if (selectedFilter === "All") {
      return true;
    }

    const status = getChallengeStatus(challenge);
    const startDate = getValidDate(challenge.startDate);
    const endDate = getValidDate(challenge.endDate);
    const now = new Date();

    switch (selectedFilter) {
      case "Active":
        return (
          status === "active" &&
          (!startDate || startDate <= now) &&
          (!endDate || endDate >= now)
        );

      case "Upcoming":
        return (
          status === "upcoming" ||
          (startDate > now &&
            status !== "ended" &&
            status !== "completed" &&
            status !== "cancelled")
        );

      case "Ended":
        return (
          status === "ended" ||
          status === "completed" ||
          status === "cancelled" ||
          (endDate && endDate < now)
        );

      default:
        return true;
    }
  });

  // Create or edit a challenge.
  const handleSaveChallenge = async (challengeData) => {
    if (!isAdmin) return;

    try {
      if (editingChallenge) {
        const id = getChallengeId(editingChallenge);

        await api.put(`/challenges/${id}`, challengeData);
        alert("Challenge updated successfully!");
      } else {
        await api.post("/challenges", challengeData);
        alert("Challenge created successfully!");
      }

      await fetchChallenges();
      setEditingChallenge(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Failed to save challenge:", error);

      alert(
        error.response?.data?.message ||
          "Unable to save challenge. Check the backend endpoint."
      );
    }
  };

  // Edit a challenge.
  const handleEdit = (challenge) => {
    if (!isAdmin) return;

    setEditingChallenge(challenge);
    setIsModalOpen(true);
  };

  // End a challenge early.
  const handleEndEarly = async (challenge) => {
    if (!isAdmin) return;

    if (
      !window.confirm(
        `Are you sure you want to end "${challenge.title}" early?`
      )
    ) {
      return;
    }

    try {
      const id = getChallengeId(challenge);

      await api.patch(`/challenges/${id}/end`);
      await fetchChallenges();

      alert("Challenge ended successfully!");
    } catch (error) {
      console.error("Failed to end challenge:", error);

      alert(
        error.response?.data?.message ||
          "Unable to end challenge. Check the backend endpoint."
      );
    }
  };

  // Delete a challenge.
  const handleDelete = async (challenge) => {
    if (!isAdmin) return;

    if (
      !window.confirm(
        `Are you sure you want to delete "${challenge.title}"?`
      )
    ) {
      return;
    }

    try {
      const id = getChallengeId(challenge);

      await api.delete(`/challenges/${id}`);
      await fetchChallenges();

      alert("Challenge deleted successfully!");
    } catch (error) {
      console.error("Failed to delete challenge:", error);

      alert(
        error.response?.data?.message ||
          "Unable to delete challenge. Check the backend endpoint."
      );
    }
  };

  if (userLoading || loadingChallenges) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <p className="text-gray-600">Loading challenges...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Challenges
          </h1>

          <p className="mt-1 text-sm text-gray-600">
            Track your progress and build sustainable habits.
          </p>
        </div>

        {isAdmin && (
          <button
            type="button"
            onClick={() => {
              setEditingChallenge(null);
              setIsModalOpen(true);
            }}
            className="rounded-lg bg-emerald-600 px-4 py-2 font-medium text-white hover:bg-emerald-700"
          >
            + Create Challenge
          </button>
        )}
      </div>

      <ChallengeFilter
        selectedFilter={selectedFilter}
        onFilterChange={setSelectedFilter}
      />

      {fetchError ? (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-red-700">{fetchError}</p>

          <button
            type="button"
            onClick={() => fetchChallenges(true)}
            className="mt-3 rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      ) : filteredChallenges.length === 0 ? (
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-600">
            No challenges found.
          </p>

          {isAdmin && (
            <p className="mt-2 text-sm text-gray-500">
              Click Create Challenge to add one.
            </p>
          )}
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredChallenges.map((challenge) => {
            const id = getChallengeId(challenge);

            let duration = challenge.duration || "Not set";

            if (
              !challenge.duration &&
              challenge.startDate &&
              challenge.endDate
            ) {
              const start = getValidDate(challenge.startDate);
              const end = getValidDate(challenge.endDate);

              if (start && end) {
                duration = `${Math.max(
                  1,
                  Math.ceil(
                    (end.getTime() - start.getTime()) /
                      (1000 * 60 * 60 * 24)
                  )
                )} days`;
              }
            }

            const participants = Array.isArray(challenge.participants)
              ? challenge.participants.length
              : Number(challenge.participants) || 0;

            return (
              <ChallengeCard
                key={id}
                title={challenge.title}
                description={challenge.description}
                duration={duration}
                participants={participants}
                status={challenge.status || "Active"}
                category={challenge.category}
                points={challenge.points || 0}
                startDate={challenge.startDate}
                endDate={challenge.endDate}
                averageProgress={challenge.averageProgress || 0}
                isAdmin={isAdmin}
                onEdit={() => handleEdit(challenge)}
                onEndEarly={() => handleEndEarly(challenge)}
                onDelete={() => handleDelete(challenge)}
              />
            );
          })}
        </div>
      )}

      {isAdmin && isModalOpen && (
        <ChallengeFormModal
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
