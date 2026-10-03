import { useNavigate } from "react-router-dom";

const ChallengeCard = ({
    title,
    description,
    duration,
    participants,
    onEdit
}) => {
    const navigate = useNavigate();

    return (
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">

            <h2 className="text-lg font-semibold text-[var(--color-slate)]">
                {title}
            </h2>

            <p className="mt-2 text-sm text-[var(--color-muted)]">
                {description}
            </p>

            <div className="mt-4 flex justify-between text-sm">
                <span className="text-[var(--color-muted)]">
                    Duration: {duration}
                </span>

                <span className="text-[var(--color-eco)]">
                    {participants} participants
                </span>
            </div>

            <div className="mt-4 flex gap-2">

                <button
                    onClick={onEdit}
                    className="flex-1 rounded-lg border border-[var(--color-eco)] px-4 py-2 text-sm font-medium text-[var(--color-eco)]"
                >
                    Edit
                </button>

                <button
                    onClick={() => navigate("/challenge-detail")}
                    className="flex-1 rounded-lg bg-[var(--color-eco)] px-4 py-2 text-sm font-medium text-white"
                >
                    View Challenge
                </button>

            </div>
        </div>
    );
};

export default ChallengeCard;