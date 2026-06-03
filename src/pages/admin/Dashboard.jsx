import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { Routes, Route, Link } from "react-router-dom";
import api from "../../api/axios";
import DashboardLayout from "../../components/DashboardLayout";
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
  const [stats, setStats] = useState({ eleves: 0, classes: 0, enseignants: 0, seances: 0 });

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

  return (
    <DashboardLayout
      menuItems={menuItems}
      gradient="bg-gradient-to-b from-blue-800 to-blue-900"
      iconColor="bg-blue-50"
      role="Administrateur"
      roleIcon="👑"
      pageTitle="Tableau de bord Admin"
    >
      <Routes>
        <Route path="/" element={
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
              Bonjour 👋
            </h2>
            <p className="text-gray-500 mb-6 text-sm lg:text-base">
              Aperçu de votre établissement
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6 mb-6 lg:mb-8">
              {[
                { label: "Élèves", value: stats.eleves, icon: "🎓", bg: "bg-blue-50", color: "text-blue-600" },
                { label: "Classes", value: stats.classes, icon: "🏫", bg: "bg-green-50", color: "text-green-600" },
                { label: "Enseignants", value: stats.enseignants, icon: "👨‍🏫", bg: "bg-purple-50", color: "text-purple-600" },
                { label: "Séances", value: stats.seances, icon: "📋", bg: "bg-orange-50", color: "text-orange-600" },
              ].map((stat, i) => (
                <div key={i} className="bg-white rounded-2xl shadow-sm p-4 lg:p-6 flex items-center gap-3 lg:gap-4">
                  <div className={`${stat.bg} p-3 lg:p-4 rounded-xl text-2xl lg:text-3xl`}>
                    {stat.icon}
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs lg:text-sm">{stat.label}</p>
                    <p className={`text-2xl lg:text-3xl font-bold ${stat.color}`}>
                      {stat.value}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Accès rapide */}
            <h3 className="text-base lg:text-lg font-semibold text-gray-700 mb-4">
              Accès rapide
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
              {[
                { label: "Élèves", icon: "🎓", path: "/admin/eleves", color: "bg-blue-500" },
                { label: "Programmes", icon: "📅", path: "/admin/programmes", color: "bg-green-500" },
                { label: "Demandes", icon: "📋", path: "/admin/demandes", color: "bg-orange-500" },
                { label: "Rapports PDF", icon: "📊", path: "/admin/rapports", color: "bg-purple-500" },
              ].map((item, i) => (
                <Link
                  key={i}
                  to={item.path}
                  className={`${item.color} text-white p-4 rounded-2xl flex flex-col items-center gap-2 hover:opacity-90 transition shadow-md`}
                >
                  <span className="text-2xl lg:text-3xl">{item.icon}</span>
                  <span className="text-xs lg:text-sm font-medium text-center">{item.label}</span>
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
    </DashboardLayout>
  );
};

export default AdminDashboard;