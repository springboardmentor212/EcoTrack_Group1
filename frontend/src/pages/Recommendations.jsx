import RecommendationCard from "../components/RecommendationCard";
import AIInsightsWidget from "../components/AIInsightsWidget";

function Recommendations() {
  const recommendations = [
    {
      category: "Transportation",
      title: "Try carpooling on your commute",
      reduction: "120 kg CO₂",
      description: "brings Transportation back under cap",
    },
    {
      category: "Energy",
      title: "Switch to LED bulbs",
      reduction: "75 kg CO₂/year",
    },
    {
      category: "Water",
      title: "Shorter showers this week",
      reduction: "15 kg CO₂",
    },
  ];

  return (
    <main className="flex-1 bg-slate-50 px-6 pb-8">
      <div className="w-full">
        <AIInsightsWidget
          category="Transportation"
          message="The suggestions below focus on that category first."
        />

        <section className="mt-4">
          <div className="grid grid-cols-3 gap-4">
            {recommendations.map((recommendation) => (
              <RecommendationCard
                key={recommendation.title}
                category={recommendation.category}
                title={recommendation.title}
                reduction={recommendation.reduction}
                description={recommendation.description}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

export default Recommendations;