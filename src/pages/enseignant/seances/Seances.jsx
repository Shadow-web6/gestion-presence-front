import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { toast } from "react-toastify";

const Seances = () => {
  const [seances, setSeances] = useState([]);
  const [programmes, setProgrammes] = useState([]);
  const [form, setForm] = useState({ programme_id: "", date: "" });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [seancesRes, progRes] = await Promise.all([
        api.get("/seances"),
        api.get("/programmes")
      ]);
      setSeances(seancesRes.data);
      setProgrammes(progRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/seances", form);
      toast.success("Séance créée !");
      setForm({ programme_id: "", date: "" });
      setShowForm(false);
      fetchData();
    } catch {
      toast.error("Erreur lors de la création !");
    } finally {
      setLoading(false);
    }
  };

  const handleFermer = async (id) => {
    if (!window.confirm("Fermer cette séance ?")) return;
    try {
      await api.post(`/seances/${id}/fermer`);
      toast.success("Séance fermée !");
      fetchData();
    } catch {
      toast.error("Erreur !");
    }
  };

  const getStatutColor = (statut) => {
    if (statut === "ouverte") return "bg-green-100 text-green-700";
    if (statut === "fermée") return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-700";
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Séances</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700"
        >
          {showForm ? "Annuler" : "+ Ouvrir une séance"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Nouvelle séance</h3>
          <form onSubmit={handleSubmit} className="flex gap-4">
            <select
              value={form.programme_id}
              onChange={e => setForm({...form, programme_id: e.target.value})}
              className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="">Sélectionner un programme</option>
              {programmes.map(p => (
                <option key={p.id} value={p.id}>
                  {p.classe?.nom} - {p.matiere?.nom} - {p.jour}
                </option>
              ))}
            </select>
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({...form, date: e.target.value})}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? "Création..." : "Créer"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600">#</th>
              <th className="px-6 py-3 text-left text-gray-600">Classe</th>
              <th className="px-6 py-3 text-left text-gray-600">Matière</th>
              <th className="px-6 py-3 text-left text-gray-600">Date</th>
              <th className="px-6 py-3 text-left text-gray-600">Statut</th>
              <th className="px-6 py-3 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {seances.map((seance, index) => (
              <tr key={seance.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{seance.programme?.classe?.nom}</td>
                <td className="px-6 py-4">{seance.programme?.matiere?.nom}</td>
                <td className="px-6 py-4">{seance.date}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${getStatutColor(seance.statut)}`}>
                    {seance.statut}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  {seance.statut === "ouverte" && (
                    <>
                      <button
                        onClick={() => navigate(`/enseignant/presences/${seance.id}`)}
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                      >
                        Marquer
                      </button>
                      <button
                        onClick={() => navigate(`/enseignant/qrcode/${seance.id}`)}
                        className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                      >
                        QR Code
                      </button>
                      <button
                        onClick={() => handleFermer(seance.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Fermer
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {seances.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                  Aucune séance trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Seances;