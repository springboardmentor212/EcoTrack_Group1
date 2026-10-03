const ChallengeProgressTracker = ({ progress = 60 }) => {
    return (
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200">

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--color-slate)]">
                    Your Progress
                </h2>

                <span className="text-sm font-semibold text-[var(--color-eco)]">
                    {progress}%
                </span>
            </div>

            <div className="mt-4 h-3 w-full rounded-full bg-gray-200">
                <div
                    className="h-3 rounded-full bg-[var(--color-eco)]"
                    style={{ width: `${progress}%` }}
                />
            </div>

            <p className="mt-3 text-sm text-[var(--color-muted)]">
                Keep going! Complete more activities to reach your goal.
            </p>

        </div>
    );
};

export default ChallengeProgressTracker;