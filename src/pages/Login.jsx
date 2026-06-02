import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      toast.success("Connexion réussie !");
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "enseignant") navigate("/enseignant");
      else if (user.role === "eleve") navigate("/eleve");
      else if (user.role === "parent") navigate("/parent");
    } catch {
      toast.error("Email ou mot de passe incorrect !");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Partie gauche - Illustration */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800 flex-col items-center justify-center p-12 text-white">
        <div className="text-center">
          <div className="text-8xl mb-6">🎓</div>
          <h1 className="text-4xl font-bold mb-4">EduPresence</h1>
          <p className="text-xl text-blue-200 mb-8">
            Plateforme intelligente de gestion des présences scolaires
          </p>
          <div className="grid grid-cols-2 gap-4 text-left">
            {[
              { icon: "✅", text: "Marquage par QR Code" },
              { icon: "🔔", text: "Notifications automatiques" },
              { icon: "📊", text: "Rapports détaillés" },
              { icon: "👨‍👩‍👧", text: "Suivi parental" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white bg-opacity-10 rounded-xl p-3">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Partie droite - Formulaire */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-gray-50">
        <div className="w-full max-w-md">
          {/* Logo mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="text-5xl mb-2">🎓</div>
            <h1 className="text-2xl font-bold text-blue-700">EduPresence</h1>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Bon retour ! 👋</h2>
            <p className="text-gray-500 mb-8">Connectez-vous à votre espace</p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    📧
                  </span>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="exemple@ecole.com"
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    🔒
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              {/* Bouton */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Connexion...
                  </span>
                ) : "Se connecter →"}
              </button>
            </form>

            {/* Comptes de démo */}
            <div className="mt-6 p-4 bg-blue-50 rounded-xl">
              <p className="text-xs font-semibold text-blue-700 mb-2">🧪 Comptes de démonstration :</p>
              <div className="grid grid-cols-2 gap-1 text-xs text-blue-600">
                <span>👑 admin@ecole.com</span>
                <span>👨‍🏫 prof@ecole.com</span>
                <span>👨‍👩‍👧 parent@ecole.com</span>
                <span>🎓 eleve@ecole.com</span>
              </div>
              <p className="text-xs text-blue-400 mt-1">Mot de passe : password</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;