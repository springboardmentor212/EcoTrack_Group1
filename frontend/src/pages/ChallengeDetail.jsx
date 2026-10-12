import { useLocation, useNavigate } from "react-router-dom";
import ChallengeProgressTracker from "../components/ChallengeProgressTracker";
import ParticipantList from "../components/ParticipantList";

const ChallengeDetail = () => {
const location = useLocation();
const navigate = useNavigate();


const challenge = location.state?.challenge;

// If the page is opened directly without selecting a challenge
if (!challenge) {
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold text-[var(--color-slate)]">
                No challenge selected
            </h1>

            <p className="mt-2 text-[var(--color-muted)]">
                Please select a challenge to view its details.
            </p>

            <button
                type="button"
                onClick={() => navigate("/challenges")}
                className="mt-4 rounded-lg bg-[var(--color-eco)] px-4 py-2 text-sm font-medium text-white"
            >
                Back to Challenges
            </button>
        </div>
    );
}

const progress = challenge.status === "Completed" ? 100 : 0;

return (
    <div className="p-6">
        {/* Challenge Information */}
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--color-slate)]">
                        {challenge.title}
                    </h1>

                    <p className="mt-2 text-[var(--color-muted)]">
                        {challenge.description}
                    </p>
                </div>

                <span
                    className={`shrink-0 rounded-full px-3 py-1 text-sm font-medium ${
                        challenge.status === "Completed"
                            ? "bg-gray-200 text-gray-700"
                            : "bg-[var(--color-eco)] text-white"
                    }`}
                >
                    {challenge.status}
                </span>
            </div>

            {/* Challenge Information */}
            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-[var(--color-muted)]">
                        Duration
                    </p>

                    <p className="mt-1 font-semibold text-[var(--color-slate)]">
                        {challenge.duration}
                    </p>
                </div>

                <div className="rounded-lg bg-gray-50 p-4">
                    <p className="text-sm text-[var(--color-muted)]">
                        Participants
                    </p>

                    <p className="mt-1 font-semibold text-[var(--color-slate)]">
                        {challenge.participants}
                    </p>
                </div>
            </div>
        </div>

        {/* Your Progress */}
        <div className="mt-6">
            <ChallengeProgressTracker progress={progress} />
        </div>

        {/* Rules */}
        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--color-slate)]">
                Rules
            </h2>

            <ul className="mt-4 space-y-3 text-sm text-[var(--color-muted)]">
                <li>• Complete the challenge activities regularly.</li>
                <li>• Follow sustainable practices throughout the challenge.</li>
                <li>• Maintain your progress during the challenge period.</li>
            </ul>
        </div>

        {/* Participants */}
        <div className="mt-6">
            <ParticipantList />
        </div>

        <button
            type="button"
            onClick={() => navigate("/challenges")}
            className="mt-6 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-[var(--color-slate)] hover:bg-gray-50"
        >
            Back to Challenges
        </button>
    </div>
);


};

export default ChallengeDetail;
