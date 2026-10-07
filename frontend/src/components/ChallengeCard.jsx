import { useNavigate } from "react-router-dom";

const ChallengeCard = ({
    title,
    description,
    duration,
    participants,
    onEdit,
    isAdmin
}) => {
    const navigate = useNavigate();

    const handleCardClick = () => {
        navigate("/challenge-detail");
    };

    return (
        <div
            onClick={handleCardClick}
            className="cursor-pointer rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
            <h2 className="text-lg font-semibold text-[var(--color-slate)]">
                {title}
            </h2>

            <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                {description}
            </p>

            <div className="mt-5 flex items-center justify-between text-sm">
                <span className="text-[var(--color-muted)]">
                    Duration: {duration}
                </span>

                <span className="text-[var(--color-eco)]">
                    {participants} participants
                </span>
            </div>

            <div className="mt-5 flex gap-3">
                {isAdmin && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onEdit();
                        }}
                        className="flex-1 rounded-lg border border-[var(--color-eco)] px-4 py-2 text-sm font-medium text-[var(--color-eco)]"
                    >
                        Edit
                    </button>
                )}

                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        navigate("/challenge-detail");
                    }}
                    className={`rounded-lg bg-[var(--color-eco)] px-4 py-2 text-sm font-medium text-white ${
                        isAdmin ? "flex-1" : "w-full"
                    }`}
                >
                    Join
                </button>
            </div>
        </div>
    );
};

export default ChallengeCard;