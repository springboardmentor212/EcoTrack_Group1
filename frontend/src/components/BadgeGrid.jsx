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
        <div>
            <h2 className="text-lg font-semibold text-[var(--color-slate)]">
                Badges
            </h2>

            <div className="mt-5 grid grid-cols-3 gap-5">
                {badges.map((badge) => (
                    <div
                        key={badge.name}
                        className="flex flex-col items-center text-center"
                    >
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-50">
                            <img
                                src={badge.image}
                                alt={badge.name}
                                className="h-10 w-10 object-contain"
                            />
                        </div>

                        <p className="mt-2 text-xs font-medium text-[var(--color-slate)]">
                            {badge.name}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default BadgeGrid;