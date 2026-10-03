function NotificationList() {
  const notifications = [
    {
      id: 1,
      title: "New challenge available",
      message: "A new eco challenge is waiting for you.",
      time: "10 min ago",
    },
    {
      id: 2,
      title: "Goal progress update",
      message: "You're making good progress toward your monthly goal.",
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "Eco score updated",
      message: "Your latest activity has updated your Eco Score.",
      time: "2 hours ago",
    },
  ];

  return (
    <div className="rounded-lg border border-slate-200 bg-white">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className="border-b border-slate-100 px-5 py-4 last:border-b-0"
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
              {notification.time}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationList;