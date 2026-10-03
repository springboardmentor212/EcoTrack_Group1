const ParticipantList = () => {
    const participants = [
        { name: "Arun", progress: 90 },
        { name: "Priya", progress: 80 },
        { name: "Varsha", progress: 60 },
        { name: "Kavin", progress: 45 }
    ];

    return (
        <div className="rounded-xl bg-white p-5 shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold text-[var(--color-slate)]">
                Participants
            </h2>

            <div className="mt-4 space-y-3">
                {participants.map((participant, index) => (
                    <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3"
                    >
                        <div>
                            <p className="font-medium text-[var(--color-slate)]">
                                {participant.name}
                            </p>

                            <p className="text-xs text-[var(--color-muted)]">
                                Progress: {participant.progress}%
                            </p>
                        </div>

                        <span className="text-sm font-semibold text-[var(--color-eco)]">
                            #{index + 1}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ParticipantList;