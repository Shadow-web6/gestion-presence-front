import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Notifications from "./Notifications";

const DashboardLayout = ({ menuItems, children, gradient, iconColor, role, roleIcon, pageTitle }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Ferme sidebar quand on change de page sur mobile
  useEffect(() => {
    if (!isDesktop) setSidebarOpen(false);
  }, [location.pathname]);

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

      {/* Overlay mobile */}
      {sidebarOpen && !isDesktop && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:relative inset-y-0 left-0 z-50
        ${gradient} text-white flex flex-col
        transition-all duration-300 ease-in-out
        ${isDesktop ? 'w-64 translate-x-0' : ''}
        ${!isDesktop && sidebarOpen ? 'w-72 translate-x-0' : ''}
        ${!isDesktop && !sidebarOpen ? 'w-72 -translate-x-full' : ''}
      `}>
        {/* Logo */}
        <div className="p-5 border-b border-white border-opacity-20 flex items-center gap-3">
          <span className="text-3xl">{roleIcon}</span>
          <div>
            <h1 className="text-lg font-bold">EduPresence</h1>
            <p className="text-white text-opacity-70 text-xs">{user?.name}</p>
          </div>
          {/* Bouton fermer sur mobile */}
          {!isDesktop && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="ml-auto text-white text-opacity-70 hover:text-white text-xl"
            >
              ✕
            </button>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {menuItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                ${isActive(item.path, item.exact)
                  ? 'bg-white text-gray-800 font-semibold shadow-lg'
                  : 'text-white text-opacity-80 hover:bg-white hover:bg-opacity-20'}`}
            >
              <span className="text-xl">{item.icon}</span>
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white border-opacity-20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition text-white"
          >
            <span className="text-xl">🚪</span>
            <span className="text-sm font-medium">Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0">

        {/* Topbar */}
        <header className="bg-white shadow-sm px-4 lg:px-6 py-4 flex justify-between items-center sticky top-0 z-30">
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 transition lg:hidden"
            >
              <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-5 h-0.5 bg-gray-600 mb-1"></div>
              <div className="w-5 h-0.5 bg-gray-600"></div>
            </button>
            <h2 className="text-base lg:text-lg font-semibold text-gray-700 truncate">
              {pageTitle}
            </h2>
          </div>
          <div className="flex items-center gap-2 lg:gap-4">
            <Notifications />
            <div className={`hidden sm:flex items-center gap-2 ${iconColor} px-3 py-2 rounded-xl`}>
              <span className="text-xl lg:text-2xl">{roleIcon}</span>
              <div className="hidden lg:block">
                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-400">{role}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;