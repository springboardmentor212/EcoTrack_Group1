import { useEffect, useState, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "sonner";
import ChallengeProgressTracker from "../components/ChallengeProgressTracker";
import ParticipantList from "../components/ParticipantList";
import * as challengeService from "../services/challengeService";
import {
  capitalize,
  formatDate,
  getDurationLabel,
} from "../utils/challengeUtils";

const STATUS_STYLES = {
  active: "bg-[var(--color-eco)] text-white",
  upcoming: "bg-sky-500 text-white",
  completed: "bg-gray-400 text-white",
};

const ChallengeDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [joining, setJoining] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await challengeService.getChallengeById(id);
      setData(res.data.data);
      setError("");
    } catch (err) {
      setError(challengeService.getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
  }, [load]);

  const handleJoin = async () => {
    setJoining(true);
    try {
      await challengeService.joinChallenge(id);
      toast.success("You joined this challenge");
      await load();
    } catch (err) {
      toast.error(challengeService.getErrorMessage(err));
    } finally {
      setJoining(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <p className="text-sm text-[var(--color-muted)]">
          Loading challenge...
        </p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-6">
        <p className="text-sm text-red-600">{error || "Challenge not found"}</p>
        <Link
          to="/challenges"
          className="mt-3 inline-block text-sm text-[var(--color-eco)]"
        >
          ← Back to challenges
        </Link>
      </div>
    );
  }

  const { challenge, participants, myProgress } = data;
  const ended = challenge.status === "completed";

  return (
    <div>
      <Link to="/challenges" className="text-sm text-[var(--color-eco)]">
        ← Back to challenges
      </Link>

      <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[var(--color-primary)]">
              {challenge.title}
            </h1>

            <p className="text-sm text-[var(--color-slate)] mt-1">
              {challenge.description}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-sm font-medium ${
              STATUS_STYLES[challenge.status] || STATUS_STYLES.active
            }`}
          >
            {capitalize(challenge.status)}
          </span>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-[var(--color-muted)]">Duration</p>
            <p className="mt-1 font-semibold text-[var(--color-slate)]">
              {getDurationLabel(challenge)}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-[var(--color-muted)]">Participants</p>
            <p className="mt-1 font-semibold text-[var(--color-slate)]">
              {challenge.participantsCount}
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-[var(--color-muted)]">
              {capitalize(challenge.category)} cap
            </p>
            <p className="mt-1 font-semibold text-[var(--color-slate)]">
              {challenge.targetMetric} kg CO₂
            </p>
          </div>

          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm text-[var(--color-muted)]">Period</p>
            <p className="mt-1 text-sm font-semibold text-[var(--color-slate)]">
              {formatDate(challenge.startDate)} –{" "}
              {formatDate(challenge.endDate)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6">
        {myProgress ? (
          <ChallengeProgressTracker
            used={myProgress.currentProgress}
            target={challenge.targetMetric}
            status={myProgress.status}
          />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--color-slate)]">
              Your Progress
            </h2>
            <p className="mt-2 text-sm text-[var(--color-muted)]">
              {ended
                ? "This challenge has ended."
                : "Join this challenge to start tracking your progress."}
            </p>
            {!ended && (
              <button
                onClick={handleJoin}
                disabled={joining}
                className="mt-4 rounded-lg bg-[var(--color-eco)] px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {joining ? "Joining..." : "Join Challenge"}
              </button>
            )}
          </div>
        )}
      </div>

      <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-[var(--color-slate)]">
          Rules
        </h2>

        <ul className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
          <li>
            • Keep your {challenge.category} emissions under{" "}
            {challenge.targetMetric} kg CO₂ between{" "}
            {formatDate(challenge.startDate)} and{" "}
            {formatDate(challenge.endDate)}.
          </li>
          <li>
            • Log your activities in Carbon Tracker — your progress updates
            automatically.
          </li>
          <li>• The lowest emissions rank first on the leaderboard.</li>
        </ul>
      </div>

      <div className="mt-6">
        <ParticipantList
          participants={participants}
          target={challenge.targetMetric}
          currentUserId={myProgress?.userId}
        />
      </div>
    </div>
  );
};

export default ChallengeDetail;
