import Sidebar from "../components/Sidebar";
import TopBar from "../components/TopBar";
import RecommendationCard from "../components/RecommendationCard";
import AIInsightsWidget from "../components/AIInsightsWidget";

function Recommendations() {
  const recommendations = [
    {
      category: "Transportation",
      title: "Try carpooling on your commute",
      reduction: "120 kg CO₂",
    },
    {
      category: "Energy",
      title: "Switch to LED bulbs",
      reduction: "75 kg CO₂/year",
    },
    {
      category: "Water",
      title: "Take shorter showers",
      reduction: "15 kg CO₂",
    },
  ];

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar />

        <main className="flex-1 p-6">
          <AIInsightsWidget
            category="Transportation"
            message="The suggestions below focus on that category first."
          />

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.title}
                category={recommendation.category}
                title={recommendation.title}
                reduction={recommendation.reduction}
              />
            ))}
          </div>
        </main>
      </div>
    </div>
  );
}

export default Recommendations;