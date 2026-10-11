import { useMemo, useState } from "react";

const initialChallenges = [
  {
    id: 1,
    title: "Zero Waste Week",
    description: "Reduce daily waste and build sustainable habits.",
    duration: "7 days",
    participants: 24,
    status: "Active",
  },
  {
    id: 2,
    title: "Green Transport",
    description: "Use eco-friendly transport to reduce emissions.",
    duration: "14 days",
    participants: 18,
    status: "Upcoming",
  },
  {
    id: 3,
    title: "Save Energy",
    description: "Reduce electricity consumption at home.",
    duration: "10 days",
    participants: 31,
    status: "Ended",
  },
];

const statusStyles = {
  Active: "bg-green-100 text-green-700",
  Upcoming: "bg-blue-100 text-blue-700",
  Ended: "bg-gray-100 text-gray-600",
};

export default function AdminChallengesPage() {
  const [challenges, setChallenges] = useState(initialChallenges);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("7 days");
  const [status, setStatus] = useState("Upcoming");

  const filteredChallenges = useMemo(
    () =>
      selectedFilter === "All"
        ? challenges
        : challenges.filter((challenge) => challenge.status === selectedFilter),
    [challenges, selectedFilter]
  );

  const handleCreateChallenge = (event) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) return;

    setChallenges((previous) => [
      ...previous,
      {
        id: Date.now(),
        title: title.trim(),
        description: description.trim(),
        duration,
        participants: 0,
        status,
      },
    ]);

    setTitle("");
    setDescription("");
    setDuration("7 days");
    setStatus("Upcoming");
    setShowForm(false);
  };

  const filters = ["All", "Active", "Upcoming", "Ended"];

  return (
    <div className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-slate)]">
            Manage Challenges
          </h1>
          <p className="mt-2 text-[var(--color-muted)]">
            Create and manage sustainability challenges.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm((previous) => !previous)}
          className="rounded-lg bg-[var(--color-eco)] px-4 py-2 text-sm font-medium text-white"
        >
          {showForm ? "Cancel" : "+ Create Challenge"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleCreateChallenge}
          className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <h2 className="text-lg font-semibold text-[var(--color-slate)]">
            New Challenge
          </h2>

          <div>
            <label className="mb-1 block text-sm font-medium">Title</label>
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Enter challenge title"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              required
              rows={3}
              className="w-full rounded-lg border border-gray-300 px-3 py-2"
              placeholder="Describe the challenge"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Duration</label>
              <select
                value={duration}
                onChange={(event) => setDuration(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option>7 days</option>
                <option>10 days</option>
                <option>14 days</option>
                <option>30 days</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>
              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2"
              >
                <option>Upcoming</option>
                <option>Active</option>
                <option>Ended</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="rounded-lg bg-[var(--color-eco)] px-4 py-2 text-sm font-medium text-white"
          >
            Save Challenge
          </button>
        </form>
      )}

      <div className="mt-6 flex flex-wrap gap-3">
        {filters.map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => setSelectedFilter(filter)}
            className={`rounded-lg px-4 py-2 text-sm font-medium ${
              selectedFilter === filter
                ? "bg-[var(--color-eco)] text-white"
                : "border border-gray-200 bg-white text-[var(--color-slate)]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredChallenges.map((challenge) => (
          <article
            key={challenge.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <h2 className="text-lg font-semibold text-[var(--color-slate)]">
                {challenge.title}
              </h2>
              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[challenge.status]}`}
              >
                {challenge.status}
              </span>
            </div>

            <p className="mt-3 text-sm text-[var(--color-muted)]">
              {challenge.description}
            </p>

            <div className="mt-5 flex justify-between gap-3 text-sm">
              <span className="text-[var(--color-muted)]">
                Duration: {challenge.duration}
              </span>
              <span className="text-[var(--color-eco)]">
                {challenge.participants} participants
              </span>
            </div>
          </article>
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <p className="mt-8 text-center text-[var(--color-muted)]">
          No challenges found for this status.
        </p>
      )}
    </div>
  );
}