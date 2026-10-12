import { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { searchCarbonEntries } from "../services/carbonService";
import * as goalService from "../services/goalService";
import { getGoalBarWidth } from "../utils/goalStatus";
import { calculateSustainabilityScore } from "../utils/sustainabilityScore";

export const SCORE_REFRESH_EVENT = "ecotrack:score-refresh";

export default function useSustainabilityScore() {
  const { pathname } = useLocation();
  const [score, setScore] = useState(null);

  const load = useCallback(async () => {
    try {
      const to = new Date();
      const from = new Date();
      from.setDate(to.getDate() - 30);

      const [entriesRes, goalsRes] = await Promise.all([
        searchCarbonEntries({
          from: from.toISOString().slice(0, 10),
          to: to.toISOString().slice(0, 10),
        }),
        goalService.getGoals(),
      ]);

      const entries = entriesRes?.data?.carbonEntries || [];
      const activeGoals = (goalsRes?.data?.goals || [])
        .filter((g) => g.status !== "completed" && g.status !== "paused")
        .map((g) => ({ percent: getGoalBarWidth(g) }));

      setScore(
        entries.length
          ? calculateSustainabilityScore(entries, activeGoals)
          : null,
      );
    } catch (err) {
      setScore(null);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load, pathname]);

  useEffect(() => {
    window.addEventListener(SCORE_REFRESH_EVENT, load);
    return () => window.removeEventListener(SCORE_REFRESH_EVENT, load);
  }, [load]);

  return score;
}
