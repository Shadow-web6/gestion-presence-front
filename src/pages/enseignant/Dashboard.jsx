import { useAuth } from "../../context/AuthContext";
import { Routes, Route, Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";
import Seances from "./seances/Seances";
import MarquerPresence from "./presences/MarquerPresence";
import QRCodeSeance from "./presences/QRCode";

const menuItems = [
  { path: "/enseignant", icon: "🏠", label: "Dashboard", exact: true },
  { path: "/enseignant/seances", icon: "📋", label: "Séances" },
];

const EnseignantDashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout
      menuItems={menuItems}
      gradient="bg-gradient-to-b from-emerald-700 to-emerald-900"
      iconColor="bg-emerald-50"
      role="Enseignant"
      roleIcon="👨‍🏫"
      pageTitle="Espace Enseignant"
    >
      <Routes>
        <Route path="/" element={
          <div>
            <h2 className="text-xl lg:text-2xl font-bold text-gray-800 mb-2">
              Bonjour, {user?.name} 👋
            </h2>
            <p className="text-gray-500 mb-6 text-sm lg:text-base">
              Gérez vos séances et présences
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-6">
              <Link to="/enseignant/seances"
                className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-5 lg:p-6 rounded-2xl shadow-md hover:shadow-lg transition flex items-center gap-4">
                <span className="text-4xl lg:text-5xl">📋</span>
                <div>
                  <p className="text-lg lg:text-xl font-bold">Mes Séances</p>
                  <p className="text-emerald-100 text-xs lg:text-sm">Gérer et marquer les présences</p>
                </div>
              </Link>
              <div className="bg-white p-5 lg:p-6 rounded-2xl shadow-sm flex items-center gap-4">
                <span className="text-4xl lg:text-5xl">📱</span>
                <div>
                  <p className="text-lg lg:text-xl font-bold text-gray-800">QR Code</p>
                  <p className="text-gray-400 text-xs lg:text-sm">Scanner pour marquer la présence</p>
                </div>
              </div>
            </div>
          </div>
        } />
        <Route path="/seances" element={<Seances />} />
        <Route path="/presences/:seanceId" element={<MarquerPresence />} />
        <Route path="/qrcode/:seanceId" element={<QRCodeSeance />} />
      </Routes>
    </DashboardLayout>
  );
};

export default EnseignantDashboard;