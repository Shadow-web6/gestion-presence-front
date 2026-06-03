import { useAuth } from "../../context/AuthContext";
import { Routes, Route, Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import Requetes from "./Requetes";

const menuItems = [
  { path: "/eleve", icon: "🏠", label: "Dashboard", exact: true },
  { path: "/eleve/requetes", icon: "📩", label: "Mes Requêtes" },
];

const EleveDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout
      menuItems={menuItems}
      gradient="bg-gradient-to-b from-purple-700 to-purple-900"
      iconColor="bg-purple-50"
      role="Élève"
      roleIcon="🎓"
      pageTitle="Espace Élève"
    >
      <Routes>
        <Route path="/" element={
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
              Bonjour, {user?.name} 👋
            </h2>
            <p className="text-gray-500 mb-6 text-sm lg:text-base">
              Suivez vos présences et soumettez vos requêtes
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <Link to="/eleve/requetes"
                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-5 lg:p-6 rounded-2xl shadow-md hover:shadow-lg transition flex items-center gap-4">
                <span className="text-4xl lg:text-5xl">📩</span>
                <div>
                  <p className="text-lg lg:text-xl font-bold">Mes Requêtes</p>
                  <p className="text-purple-100 text-xs lg:text-sm">Contestations et justifications</p>
                </div>
              </Link>
              <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <span className="text-4xl lg:text-5xl">📱</span>
                <div>
                  <p className="text-lg lg:text-xl font-bold text-gray-800">QR Code</p>
                  <p className="text-gray-400 text-xs lg:text-sm">Scanner pour marquer votre présence</p>
                </div>
              </div>
            </div>
          </div>
        } />
        <Route path="/requetes" element={<Requetes />} />
      </Routes>
    </DashboardLayout>
  );
};

export default EleveDashboard;