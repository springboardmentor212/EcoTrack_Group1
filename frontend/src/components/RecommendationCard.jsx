import { useState } from "react";
import { toast } from "sonner";

function RecommendationCard({
  category,
  title,
  reduction,
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  const handleAccept = () => {
    toast.success("Recommendation accepted!");
  };

  const handleDismiss = () => {
    setDismissed(true);
    toast("Recommendation dismissed");
  };

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4">
      <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase text-blue-600">
        {category}
      </span>

      <h3 className="mt-2 text-sm font-semibold text-gray-900">
        {title}
      </h3>

      <p className="mt-2 text-xs text-gray-500">
        Potential reduction: {reduction}
      </p>

      <div className="mt-3 flex gap-2">
        <button
          type="button"
          onClick={handleAccept}
          className="rounded-lg bg-emerald-500 px-4 py-2 text-xs font-semibold text-white hover:bg-emerald-600"
        >
          Accept
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-lg border border-blue-500 px-4 py-2 text-xs font-semibold text-blue-600 hover:bg-blue-50"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default RecommendationCard;