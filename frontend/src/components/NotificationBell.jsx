import { Bell } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useNotifications from "../hooks/useNotifications";

function NotificationBell() {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  return (
    <button
      type="button"
      onClick={() => navigate("/notifications")}
      aria-label={
        unreadCount > 0
          ? `Notifications, ${unreadCount} unread`
          : "Notifications"
      }
      className="relative text-[var(--color-slate)] cursor-pointer"
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <span className="absolute -top-1.5 -right-1.5 min-w-[18px] h-[18px] px-1 rounded-full bg-red-500 text-white text-[10px] font-semibold flex items-center justify-center">
          {unreadCount > 9 ? "9+" : unreadCount}
        </span>
      )}
    </button>
  );
}

export default NotificationBell;
