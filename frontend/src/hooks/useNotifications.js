import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import api from "../services/api";

const POLL_MS = 15000;

export default function useNotifications() {
  const [unreadCount, setUnreadCount] = useState(0);
  const seen = useRef(null); 

  const refresh = useCallback(async () => {
    try {
      const res = await api.get("/notifications", { params: { limit: 10 } });
      const list = res.data.data || [];
      setUnreadCount(res.data.unreadCount || 0);

      if (seen.current === null) {
        seen.current = new Set(list.map((n) => n._id));
        return;
      }

      list
        .filter((n) => !n.isRead && !seen.current.has(n._id))
        .reverse() 
        .forEach((n) => toast(n.title, { description: n.message }));

      list.forEach((n) => seen.current.add(n._id));
    } catch {
      /* ignore network errors; next poll will retry */
    }
  }, []);

  useEffect(() => {
    refresh();
    const timer = setInterval(refresh, POLL_MS);
    window.addEventListener("focus", refresh);
    window.addEventListener("notifications:refresh", refresh);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", refresh);
      window.removeEventListener("notifications:refresh", refresh);
    };
  }, [refresh]);

  return { unreadCount, refresh };
}