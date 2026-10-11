import ChallengeProgressTracker from "../components/ChallengeProgressTracker";
import ParticipantList from "../components/ParticipantList";
import LeaderboardTable from "../components/LeaderboardTable";

const ChallengeDetail = () => {
    return (
        <div className="p-6">

            <div className="rounded-xl bg-white p-6 shadow-sm border border-gray-200">
                <h1 className="text-2xl font-bold text-[var(--color-slate)]">
                    Zero Waste Week
                </h1>

                <p className="mt-3 text-[var(--color-muted)]">
                    Reduce your daily waste and follow sustainable habits
                    throughout the week.
                </p>

                <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">

                    <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-[var(--color-muted)]">
                            Duration
                        </p>
                        <p className="mt-1 font-semibold">
                            7 days
                        </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-[var(--color-muted)]">
                            Participants
                        </p>
                        <p className="mt-1 font-semibold">
                            24
                        </p>
                    </div>

                    <div className="rounded-lg bg-gray-50 p-4">
                        <p className="text-sm text-[var(--color-muted)]">
                            Status
                        </p>
                        <p className="mt-1 font-semibold text-[var(--color-eco)]">
                            Active
                        </p>
                    </div>

                </div>
            </div>

            <div className="mt-6">
                <ChallengeProgressTracker progress={60} />
            </div>

            <div className="mt-6">
                <ParticipantList />
            </div>
            <div className="mt-6">
    <h2 className="mb-3 text-lg font-semibold text-[var(--color-slate)]">
        Challenge Leaderboard
    </h2>
    <LeaderboardTable
        users={[
            { name: "Arun", score: 90 },
            { name: "Priya", score: 80 },
            { name: "Varsha", score: 60 },
            { name: "Kavin", score: 45 },
        ]}
    />
</div>

        </div>
    );
};

export default ChallengeDetail;