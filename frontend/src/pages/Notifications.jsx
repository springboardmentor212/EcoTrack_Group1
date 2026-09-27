import NotificationList from "../components/NotificationList";

function Notifications() {
  return (
    <main className="flex-1 bg-slate-50 px-6 pb-8">
      <div className="w-full">
        <div className="mb-5">
          <h1 className="text-xl font-bold text-slate-900">
            Notifications
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Stay updated with your EcoTrack activity.
          </p>
        </div>

        <NotificationList />
      </div>
    </main>
  );
}

export default Notifications;