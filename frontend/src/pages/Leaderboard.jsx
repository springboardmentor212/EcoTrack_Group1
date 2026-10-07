import { useState, useEffect } from "react";
import LeaderboardTable from "../components/LeaderboardTable";
import BadgeGrid from "../components/BadgeGrid";
import useSustainabilityScore from "../hooks/useSustainabilityScore";
import * as leaderboardService from "../services/leaderboardService";
import * as challengeService from "../services/challengeService";

const Leaderboard = () => {
  const [activeTab, setActiveTab] = useState("Global");

  const [globalRows, setGlobalRows] = useState([]);
  const [me, setMe] = useState(null);
  const [total, setTotal] = useState(0);
  const [globalLoading, setGlobalLoading] = useState(true);
  const [globalError, setGlobalError] = useState("");

  const [myChallenges, setMyChallenges] = useState([]);
  const [selectedId, setSelectedId] = useState("");
  const [challengeRows, setChallengeRows] = useState([]);
  const [challengeLoading, setChallengeLoading] = useState(false);
  const [challengeError, setChallengeError] = useState("");

  const myScore = useSustainabilityScore();

  useEffect(() => {
    (async () => {
      try {
        const res = await leaderboardService.getLeaderboard({
          limit: 20,
        });
        setGlobalRows(
          (res.data.data || []).map((r) => ({
            userId: r.userId,
            name: r.name,
            value: String(r.ecoScore),
            extra: r.level,
            isMe: r.isMe,
          })),
        );
        setMe(res.data.me || null);
        setTotal(res.data.total || 0);
      } catch (err) {
        setGlobalError(challengeService.getErrorMessage(err));
      } finally {
        setGlobalLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await challengeService.getMyChallenges();
        const list = res.data.data || [];
        setMyChallenges(list);
        const first = list.find((c) => c.status === "active") || list[0];
        if (first) setSelectedId(first.challengeId);
      } catch (err) {
        setMyChallenges([]);
      }
    })();
  }, []);

  useEffect(() => {
    if (!selectedId) {
      setChallengeRows([]);
      return;
    }

    let cancelled = false;

    (async () => {
      setChallengeLoading(true);
      setChallengeError("");
      try {
        const res = await challengeService.getChallengeById(selectedId);
        if (cancelled) return;

        const { challenge, participants, myProgress } = res.data.data;
        setChallengeRows(
          participants.map((p) => ({
            userId: p.userId,
            name: p.name,
            value: `${p.currentProgress} kg`,
            extra:
              challenge.targetMetric > 0
                ? `${Math.round(
                    (p.currentProgress / challenge.targetMetric) * 100,
                  )}% of cap`
                : "—",
            isMe: String(p.userId) === String(myProgress?.userId),
          })),
        );
      } catch (err) {
        if (!cancelled) {
          setChallengeError(challengeService.getErrorMessage(err));
        }
      } finally {
        if (!cancelled) setChallengeLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [selectedId]);

  const tabClass = (tab) =>
    `px-5 py-3 text-sm font-medium ${
      activeTab === tab
        ? "border-b-2 border-[var(--color-eco)] text-[var(--color-eco)]"
        : "text-[var(--color-muted)]"
    }`;

  return (
    <div className="p-6">
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-slate)]">
          Leaderboard
        </h1>

        <p className="mt-2 text-[var(--color-muted)]">
          Global rankings, challenge rankings and badges
        </p>
      </div>

      <div className="mt-6 flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("Global")}
          className={tabClass("Global")}
        >
          Global
        </button>

        <button
          onClick={() => setActiveTab("Challenge")}
          className={tabClass("Challenge")}
        >
          My Challenges
        </button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {activeTab === "Global" ? (
            globalLoading ? (
              <p className="text-sm text-[var(--color-muted)]">
                Loading rankings...
              </p>
            ) : globalError ? (
              <p className="text-sm text-red-600">{globalError}</p>
            ) : (
              <LeaderboardTable
                users={globalRows}
                valueHeader="Eco Score"
                extraHeader="Title"
                emptyMessage="No rankings yet. Log an entry to appear here."
              />
            )
          ) : myChallenges.length === 0 ? (
            <p className="text-sm text-[var(--color-muted)]">
              Join a challenge to see its leaderboard.
            </p>
          ) : (
            <>
              <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                className="mb-4 w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                {myChallenges.map((c) => (
                  <option key={c.challengeId} value={c.challengeId}>
                    {c.title} ({c.status})
                  </option>
                ))}
              </select>

              {challengeLoading ? (
                <p className="text-sm text-[var(--color-muted)]">
                  Loading rankings...
                </p>
              ) : challengeError ? (
                <p className="text-sm text-red-600">{challengeError}</p>
              ) : (
                <LeaderboardTable
                  users={challengeRows}
                  valueHeader="Emissions"
                  extraHeader="Cap used"
                  emptyMessage="No participants yet."
                />
              )}
            </>
          )}
        </div>

        <div className="space-y-6">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold text-[var(--color-slate)]">
              Your Eco Score
            </h2>

            <div className="mt-5 flex items-center justify-center">
              <div className="flex h-28 w-28 items-center justify-center rounded-full border-8 border-[var(--color-eco)]">
                <span className="text-3xl font-bold text-[var(--color-slate)]">
                  {myScore ?? "—"}
                </span>
              </div>
            </div>

            <p className="mt-4 text-center text-sm text-[var(--color-muted)]">
              {me
                ? `You are #${me.rank} of ${total}`
                : "Log an entry to join the rankings"}
            </p>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <BadgeGrid />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
