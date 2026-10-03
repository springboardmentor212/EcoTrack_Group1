const BadgeGrid = () => {
    const badges = [
        {
            name: "Eco Starter",
            description: "Complete your first sustainability challenge",
            image: "/badges/ecotrack.png",
            unlocked: true,
        },
        {
            name: "Daily Recycler",
            description: "Complete activities for 3 consecutive days",
            image: "/badges/recycle.png",
            unlocked: true,
        },
        {
            name: "Green Warrior",
            description: "Complete 5 sustainability challenges",
            image: "/badges/green%20warrior.jpeg",
            unlocked: true,
        },
        {
            name: "Carbon Saver",
            description: "Reduce your carbon footprint",
            image: "/badges/carbon%20saver.jpeg",
            unlocked: false,
        },
        {
            name: "Consistency Champ",
            description: "Stay active for 7 consecutive days",
            image: "/badges/calendar.jpeg",
            unlocked: false,
            progress: "5/7",
        },
        {
            name: "Planet Protector",
            description: "Complete 10 sustainability challenges",
            image: "/badges/planet%20saver.jpeg",
            unlocked: false,
            progress: "6/10",
        },
    ];

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-[var(--color-slate)]">
                Badges
            </h2>

            <div className="mt-4 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {badges.map((badge) => (
                    <div
                        key={badge.name}
                        className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        <div className="flex items-center gap-4">

                            {/* Badge Image */}
                            <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-emerald-400 bg-emerald-50 shadow-md shadow-emerald-100">
                                <img
                                    src={badge.image}
                                    alt={badge.name}
                                    className="h-16 w-16 object-contain"
                                />
                            </div>

                            {/* Badge Details */}
                            <div className="min-w-0 flex-1">
                                <h3 className="font-semibold text-[var(--color-slate)]">
                                    {badge.name}
                                </h3>

                                <p className="mt-1 text-sm text-[var(--color-muted)]">
                                    {badge.description}
                                </p>

                                {badge.unlocked ? (
                                    <p className="mt-2 text-sm font-medium text-[var(--color-eco)]">
                                        ✓ Earned
                                    </p>
                                ) : badge.progress ? (
                                    <p className="mt-2 text-sm font-medium text-orange-500">
                                        Progress: {badge.progress}
                                    </p>
                                ) : (
                                    <p className="mt-2 text-sm font-medium text-gray-500">
                                        In Progress
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BadgeGrid;