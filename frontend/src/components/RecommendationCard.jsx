import { useState } from "react";
import { toast } from "sonner";

function RecommendationCard({
  category,
  title,
  reduction,
  description,
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) {
    return null;
  }

  const categoryStyles = {
    Transportation: "bg-blue-100 text-blue-600",
    Energy: "bg-amber-100 text-amber-600",
    Water: "bg-cyan-100 text-cyan-600",
  };

  const handleAccept = () => {
    toast.success("Recommendation accepted!");
  };

  const handleDismiss = () => {
    setDismissed(true);
  };

  return (
    <div className="rounded-lg border border-slate-200 bg-white px-4 py-3.5">
      <span
        className={`inline-block rounded-md px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
          categoryStyles[category]
        }`}
      >
        {category}
      </span>

      <h3 className="mt-2 text-sm font-bold text-slate-900">
        {title}
      </h3>

      <p className="mt-1 text-[11px] leading-4 text-slate-500">
        Potential reduction: {reduction}
        {description && (
          <>
            {" "}
            · {description}
          </>
        )}
      </p>

      <div className="mt-3 flex justify-end gap-2">
        <button
          type="button"
          onClick={handleAccept}
          className="rounded-md bg-[#10b981] px-3 py-1.5 text-xs font-semibold text-white"
        >
          Accept
        </button>

        <button
          type="button"
          onClick={handleDismiss}
          className="rounded-md border border-[#0284c7] px-3 py-1.5 text-xs font-semibold text-[#0284c7]"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}

export default RecommendationCard;