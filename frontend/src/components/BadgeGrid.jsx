const BadgeGrid = () => {
    const badges = [
        {
            name: "Eco Starter",
            image: "/badges/ecotrack.png",
        },
        {
            name: "Daily Recycler",
            image: "/badges/recycle.png",
        },
        {
            name: "Green Warrior",
            image: "/badges/green%20warrior.jpeg",
        },
        {
            name: "Carbon Saver",
            image: "/badges/carbon%20saver.jpeg",
        },
        {
            name: "Consistency Champ",
            image: "/badges/calendar.jpeg",
        },
        {
            name: "Planet Protector",
            image: "/badges/planet%20saver.jpeg",
        },
    ];

    return (
        <div className="mt-8">
            <h2 className="text-xl font-semibold text-[var(--color-slate)]">
                Badges
            </h2>

            <div className="mt-4 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-6">
                {badges.map((badge) => (
                    <div
                        key={badge.name}
                        className="flex flex-col items-center rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                    >
                        {/* Badge Image */}
                        <div className="flex h-24 w-24 items-center justify-center">
                            <img
                                src={badge.image}
                                alt={badge.name}
                                className="h-20 w-20 object-contain"
                            />
                        </div>

                        {/* Badge Heading */}
                        <h3 className="mt-4 text-center font-semibold text-[var(--color-slate)]">
                            {badge.name}
                        </h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BadgeGrid;