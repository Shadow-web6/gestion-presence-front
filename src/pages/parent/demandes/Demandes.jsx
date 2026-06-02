import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../../context/AuthContext";

const Demandes = () => {
  const { user } = useAuth();
  const [demandes, setDemandes] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [seances, setSeances] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    eleve_id: "",
    seance_id: "",
    date_debut: "",
    date_fin: "",
    motif: ""
  });

const fetchData = async () => {
  setLoading(true);
  try {
    const [demandesRes, elevesRes] = await Promise.all([
      api.get("/demandes"),
      api.get("/eleves")
    ]);
    setDemandes(demandesRes.data);
    // Filtrer uniquement les enfants du parent connecté
    const mesEnfants = elevesRes.data.filter(e => 
      e.parents?.some(p => p.id === user.id)
    );
    setEleves(mesEnfants);
  } catch (err) {
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/demandes", form);
      toast.success("Demande envoyée avec succès !");
      setForm({ eleve_id: "", seance_id: "", date_debut: "", date_fin: "", motif: "" });
      setShowForm(false);
      fetchData();
    } catch {
      toast.error("Erreur lors de l'envoi !");
    }
  };

  const getStatutColor = (statut) => {
    if (statut === "approuvée") return "bg-green-100 text-green-700";
    if (statut === "rejetée") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Demandes de Permission</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
        >
          {showForm ? "Annuler" : "+ Nouvelle demande"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Nouvelle demande de permission</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={form.eleve_id}
              onChange={e => setForm({...form, eleve_id: e.target.value})}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            >
              <option value="">Sélectionner l'élève</option>
              {eleves.map(e => (
                <option key={e.id} value={e.id}>
                  {e.user?.name} — {e.classe?.nom}
                </option>
              ))}
            </select>

            <input
              type="date"
              value={form.date_debut}
              onChange={e => setForm({...form, date_debut: e.target.value})}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <input
              type="date"
              value={form.date_fin}
              onChange={e => setForm({...form, date_fin: e.target.value})}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              required
            />

            <textarea
              value={form.motif}
              onChange={e => setForm({...form, motif: e.target.value})}
              placeholder="Motif de l'absence..."
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 md:col-span-2"
              rows={3}
              required
            />

            <div className="md:col-span-2">
              <button
                type="submit"
                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700"
              >
                Envoyer la demande
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600">#</th>
              <th className="px-6 py-3 text-left text-gray-600">Élève</th>
              <th className="px-6 py-3 text-left text-gray-600">Période</th>
              <th className="px-6 py-3 text-left text-gray-600">Motif</th>
              <th className="px-6 py-3 text-left text-gray-600">Statut</th>
              <th className="px-6 py-3 text-left text-gray-600">Commentaire</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((demande, index) => (
              <tr key={demande.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{demande.eleve?.user?.name}</td>
                <td className="px-6 py-4">{demande.date_debut} → {demande.date_fin}</td>
                <td className="px-6 py-4">{demande.motif}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${getStatutColor(demande.statut)}`}>
                    {demande.statut}
                  </span>
                </td>
                <td className="px-6 py-4">{demande.commentaire || "-"}</td>
              </tr>
            ))}
            {demandes.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                  Aucune demande trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Demandes;