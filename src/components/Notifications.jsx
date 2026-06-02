import { useState, useEffect } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [unread, setUnread] = useState(0);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data);
      setUnread(res.data.filter(n => !n.read_at).length);
    } catch {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleLireTout = async () => {
    try {
      await api.post("/notifications/lire-tout");
      fetchNotifications();
      toast.success("Toutes les notifications lues !");
    } catch {}
  };

  const getIcon = (type) => {
    if (type === "alerte") return "⚠️";
    if (type === "absence") return "📋";
    return "🔔";
  };

  return (
    <div className="relative">
      {/* Cloche */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 text-white hover:bg-white hover:bg-opacity-20 rounded-lg"
      >
        🔔
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {showPanel && (
        <div className="absolute right-0 top-12 w-96 bg-white rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center p-4 border-b">
            <h3 className="font-bold text-gray-800">Notifications</h3>
            {unread > 0 && (
              <button
                onClick={handleLireTout}
                className="text-sm text-blue-600 hover:underline"
              >
                Tout lire
              </button>
            )}
          </div>

          {notifications.length === 0 ? (
            <p className="text-center text-gray-400 p-6">Aucune notification</p>
          ) : (
            notifications.map(notif => (
              <div
                key={notif.id}
                className={`p-4 border-b hover:bg-gray-50 ${!notif.read_at ? "bg-blue-50" : ""}`}
              >
                <div className="flex gap-3">
                  <span className="text-xl">{getIcon(notif.data?.type)}</span>
                  <div>
                    <p className="text-sm text-gray-800">{notif.data?.message}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(notif.created_at).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;