import { useState, useEffect } from "react";
import { toast } from "sonner";
import { api } from "../services/ecoApi";
import RecommendationCard from "../components/RecommendationCard";
import AIInsightsWidget from "../components/AIInsightsWidget";

const capitalize = (str) =>
  str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";

function Recommendations() {
  const [recs, setRecs] = useState([]);
  const [topCap, setTopCap] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const recRes = await api.getRecommendations();
        setRecs(recRes?.data || []);
        setEmptyMessage(recRes?.message || "");
        setTopCap(recRes?.topCap || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleAccept = async (id) => {
    try {
      await api.acceptRecommendation(id);
      setRecs((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status: "accepted" } : r)),
      );
      toast.success("Recommendation accepted!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDismiss = async (id) => {
    try {
      await api.dismissRecommendation(id);
      setRecs((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <main className="flex-1 bg-slate-50 px-6 pb-8">
      <div className="w-full">
        {loading && (
          <p className="text-sm text-slate-500">Loading recommendations…</p>
        )}
        {error && <p className="text-sm text-red-600">{error}</p>}

        {!loading && !error && topCap && (
          <AIInsightsWidget
            category={capitalize(topCap.category)}
            percentUsed={topCap.percentUsed}
            used={topCap.usage}
            cap={topCap.cap}
            message="The suggestions below focus on that category first."
          />
        )}

        {!loading && !error && recs.length === 0 && (
          <p className="mt-4 text-sm text-slate-500">
            {emptyMessage ||
              "No recommendations right now — check back tomorrow."}
          </p>
        )}

        <section className="mt-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recs.map((rec) => (
              <RecommendationCard
                key={rec._id}
                category={rec.category}
                title={rec.title}
                description={rec.description}
                status={rec.status}
                onAccept={() => handleAccept(rec._id)}
                onDismiss={() => handleDismiss(rec._id)}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Recommendations;
