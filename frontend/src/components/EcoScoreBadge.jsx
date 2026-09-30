const EcoScoreBadge = ({ score }) => {
    return (
        <span className="rounded-full bg-[var(--color-eco)] px-3 py-1 text-sm font-semibold text-white">
            {score} pts
        </span>
    );
};

export default EcoScoreBadge;