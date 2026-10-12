import { useState, useEffect } from "react";
import { api } from "../services/ecoApi";

function NotificationList() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const res = await api.getNotifications();
      setNotifications(res.data || []);
      setUnreadCount(res.unreadCount || 0);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      fetchNotifications();
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-slate-500">
          {unreadCount} unread
        </span>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="text-xs font-medium text-emerald-600 hover:text-emerald-700"
          >
            Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="p-8 text-center text-sm text-slate-500">
          No notifications yet.
        </div>
      ) : (
        notifications.map((notification) => (
          <div
            key={notification._id}
            onClick={() =>
              !notification.isRead && handleMarkRead(notification._id)
            }
            className={`border-b border-slate-100 px-5 py-4 last:border-b-0 cursor-pointer ${
              !notification.isRead ? "bg-emerald-50/50 font-medium" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">
                  {notification.title}
                </h3>
                <p className="mt-1 text-sm text-slate-500">
                  {notification.message}
                </p>
              </div>
              <span className="whitespace-nowrap text-xs text-slate-400">
                {new Date(notification.createdAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default NotificationList;
