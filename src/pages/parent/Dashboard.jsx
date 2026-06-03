import { useAuth } from "../../context/AuthContext";
import { Routes, Route, Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import Demandes from "./demandes/Demandes";

const menuItems = [
  { path: "/parent", icon: "🏠", label: "Dashboard", exact: true },
  { path: "/parent/demandes", icon: "📋", label: "Demandes de permission" },
];

const ParentDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout
      menuItems={menuItems}
      gradient="bg-gradient-to-b from-orange-600 to-orange-800"
      iconColor="bg-orange-50"
      role="Parent"
      roleIcon="👨‍👩‍👧"
      pageTitle="Espace Parent"
    >
      <Routes>
        <Route path="/" element={
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
              Bonjour, {user?.name} 👋
            </h2>
            <p className="text-gray-500 mb-6 text-sm lg:text-base">
              Suivez la présence de votre enfant
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <Link to="/parent/demandes"
                className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-5 lg:p-6 rounded-2xl shadow-md hover:shadow-lg transition flex items-center gap-4">
                <span className="text-4xl lg:text-5xl">📋</span>
                <div>
                  <p className="text-lg lg:text-xl font-bold">Demandes</p>
                  <p className="text-orange-100 text-xs lg:text-sm">Gérer les permissions d'absence</p>
                </div>
              </Link>
              <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <span className="text-4xl lg:text-5xl">🔔</span>
                <div>
                  <p className="text-lg lg:text-xl font-bold text-gray-800">Notifications</p>
                  <p className="text-gray-400 text-xs lg:text-sm">Alertes d'absence en temps réel</p>
                </div>
              </div>
            </div>
          </div>
        } />
        <Route path="/demandes" element={<Demandes />} />
      </Routes>
    </DashboardLayout>
  );
};

export default ParentDashboard;