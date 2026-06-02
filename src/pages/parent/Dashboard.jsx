import { useAuth } from "../../context/AuthContext";
import { useNavigate, Routes, Route, Link, useLocation } from "react-router-dom";
import Notifications from "../../components/Notifications";
import Demandes from "./demandes/Demandes";

const menuItems = [
  { path: "/parent", icon: "🏠", label: "Dashboard", exact: true },
  { path: "/parent/demandes", icon: "📋", label: "Demandes de permission" },
];

const ParentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-orange-600 to-orange-800 text-white flex flex-col">
        <div className="p-5 border-b border-orange-500 flex items-center gap-3">
          <span className="text-3xl">👨‍👩‍👧</span>
          <div>
            <h1 className="text-lg font-bold">EduPresence</h1>
            <p className="text-orange-200 text-xs">{user?.name}</p>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${isActive(item.path, item.exact)
                  ? 'bg-white text-orange-700 font-semibold shadow-lg'
                  : 'text-orange-100 hover:bg-orange-500'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-3 border-t border-orange-500">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 transition text-white"
          >
            <span className="text-xl">🚪</span>
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-gray-700">Espace Parent</h2>
          <div className="flex items-center gap-4">
            <Notifications />
            <div className="flex items-center gap-2 bg-orange-50 px-3 py-2 rounded-xl">
              <span className="text-2xl">👨‍👩‍👧</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-400">Parent</p>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto bg-slate-50">
          <Routes>
            <Route path="/" element={
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                  Bonjour, {user?.name} 👋
                </h2>
                <p className="text-gray-500 mb-6">Suivez la présence de votre enfant</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Link to="/parent/demandes"
                    className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-6 rounded-2xl shadow-md hover:shadow-lg transition flex items-center gap-4">
                    <span className="text-5xl">📋</span>
                    <div>
                      <p className="text-xl font-bold">Demandes</p>
                      <p className="text-orange-100 text-sm">Gérer les permissions d'absence</p>
                    </div>
                  </Link>
                  <div className="bg-white p-6 rounded-2xl shadow-sm flex items-center gap-4">
                    <span className="text-5xl">🔔</span>
                    <div>
                      <p className="text-xl font-bold text-gray-800">Notifications</p>
                      <p className="text-gray-400 text-sm">Alertes d'absence en temps réel</p>
                    </div>
                  </div>
                </div>
              </div>
            } />
            <Route path="/demandes" element={<Demandes />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default ParentDashboard;