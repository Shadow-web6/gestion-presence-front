import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Routes, Route, Link, useLocation } from "react-router-dom";
import api from "../../api/axios";
import Notifications from "../../components/Notifications";
import Niveaux from "./niveaux/Niveaux";
import Classes from "./classes/Classes";
import Matieres from "./matieres/Matieres";
import Eleves from "./eleves/Eleves";
import Programmes from "./programmes/Programmes";
import Users from "./users/Users";
import DemandesAdmin from "./demandes/DemandesAdmin";
import Requetes from "./demandes/Requetes";
import Rapports from "./rapports/Rapports";

const menuItems = [
  { path: "/admin", icon: "🏠", label: "Dashboard", exact: true },
  { path: "/admin/users", icon: "👥", label: "Utilisateurs" },
  { path: "/admin/niveaux", icon: "📚", label: "Niveaux" },
  { path: "/admin/classes", icon: "🏫", label: "Classes" },
  { path: "/admin/matieres", icon: "📖", label: "Matières" },
  { path: "/admin/eleves", icon: "🎓", label: "Élèves" },
  { path: "/admin/programmes", icon: "📅", label: "Programmes" },
  { path: "/admin/demandes", icon: "📋", label: "Demandes" },
  { path: "/admin/requetes", icon: "📩", label: "Requêtes" },
  { path: "/admin/rapports", icon: "📊", label: "Rapports" },
];

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [stats, setStats] = useState({ eleves: 0, classes: 0, enseignants: 0, seances: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [eleves, classes, users, seances] = await Promise.all([
          api.get("/eleves"),
          api.get("/classes"),
          api.get("/users"),
          api.get("/seances"),
        ]);
        setStats({
          eleves: eleves.data.length,
          classes: classes.data.length,
          enseignants: users.data.filter(u => u.role === "enseignant").length,
          seances: seances.data.length,
        });
      } catch {}
    };
    fetchStats();
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const isActive = (path, exact = false) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-gradient-to-b from-blue-800 to-blue-900 text-white flex flex-col transition-all duration-300`}>
        {/* Logo */}
        <div className="p-5 border-b border-blue-700 flex items-center gap-3">
          <span className="text-3xl">🎓</span>
          {sidebarOpen && (
            <div>
              <h1 className="text-lg font-bold">EduPresence</h1>
              <p className="text-blue-300 text-xs">{user?.name}</p>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${isActive(item.path, item.exact)
                  ? 'bg-white text-blue-800 font-semibold shadow-lg'
                  : 'text-blue-100 hover:bg-blue-700'}`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-blue-700">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 transition text-white"
          >
            <span className="text-xl">🚪</span>
            {sidebarOpen && <span className="text-sm font-medium">Déconnexion</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition"
            >
              ☰
            </button>
            <h2 className="text-lg font-semibold text-gray-700">
              Tableau de bord Admin
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <Notifications />
            <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-xl">
              <span className="text-2xl">👑</span>
              <div>
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-400">Administrateur</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-y-auto bg-slate-50">
          <Routes>
            <Route path="/" element={
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Bonjour, {user?.name} 👋</h2>
                <p className="text-gray-500 mb-6">Voici un aperçu de votre établissement</p>

                {/* Stats cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  {[
                    { label: "Élèves", value: stats.eleves, icon: "🎓", color: "from-blue-500 to-blue-600", bg: "bg-blue-50" },
                    { label: "Classes", value: stats.classes, icon: "🏫", color: "from-green-500 to-green-600", bg: "bg-green-50" },
                    { label: "Enseignants", value: stats.enseignants, icon: "👨‍🏫", color: "from-purple-500 to-purple-600", bg: "bg-purple-50" },
                    { label: "Séances", value: stats.seances, icon: "📋", color: "from-orange-500 to-orange-600", bg: "bg-orange-50" },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white rounded-2xl shadow-sm p-6 flex items-center gap-4 hover:shadow-md transition">
                      <div className={`${stat.bg} p-4 rounded-xl text-3xl`}>
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">{stat.label}</p>
                        <p className={`text-3xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                          {stat.value}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Accès rapide */}
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Accès rapide</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Gérer les élèves", icon: "🎓", path: "/admin/eleves", color: "bg-blue-500" },
                    { label: "Programmes", icon: "📅", path: "/admin/programmes", color: "bg-green-500" },
                    { label: "Demandes", icon: "📋", path: "/admin/demandes", color: "bg-orange-500" },
                    { label: "Rapports PDF", icon: "📊", path: "/admin/rapports", color: "bg-purple-500" },
                  ].map((item, i) => (
                    <Link
                      key={i}
                      to={item.path}
                      className={`${item.color} text-white p-4 rounded-2xl flex flex-col items-center gap-2 hover:opacity-90 transition shadow-md hover:shadow-lg`}
                    >
                      <span className="text-3xl">{item.icon}</span>
                      <span className="text-sm font-medium text-center">{item.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            } />
            <Route path="/niveaux" element={<Niveaux />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/matieres" element={<Matieres />} />
            <Route path="/eleves" element={<Eleves />} />
            <Route path="/programmes" element={<Programmes />} />
            <Route path="/users" element={<Users />} />
            <Route path="/demandes" element={<DemandesAdmin />} />
            <Route path="/requetes" element={<Requetes />} />
            <Route path="/rapports" element={<Rapports />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;