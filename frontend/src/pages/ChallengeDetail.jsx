import ChallengeProgressTracker from "../components/ChallengeProgressTracker";
import ParticipantList from "../components/ParticipantList";

const ChallengeDetail = () => {
    return (
        <div className="p-6">

            {/* Challenge Information */}
            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--color-slate)]">
                            Zero Waste Week
                        </h1>

                        <p className="mt-2 text-[var(--color-muted)]">
                            Reduce your daily waste and follow sustainable
                            habits throughout the week.
                        </p>
                    </div>

                    <span className="rounded-full bg-[var(--color-eco)] px-3 py-1 text-sm font-medium text-white">
                        Active
                    </span>
                </div>

                {/* Challenge Information */}
                <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

                    <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-[var(--color-muted)]">
                            Duration
                        </p>

                        <p className="mt-1 font-semibold text-[var(--color-slate)]">
                            7 days
                        </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-[var(--color-muted)]">
                            Participants
                        </p>

                        <p className="mt-1 font-semibold text-[var(--color-slate)]">
                            24
                        </p>
                    </div>

                </div>
            </div>

            {/* Your Progress */}
            <div className="mt-6">
                <ChallengeProgressTracker progress={60} />
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

        </div>
    );
};

export default ChallengeDetail;