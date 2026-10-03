import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";

function NotificationBell() {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate("/notifications")}
      aria-label="Notifications"
      className="relative text-[var(--color-slate)]"
    >
      <Bell size={20} />
    </button>
  );
}

export default NotificationBell;