import { useState, useEffect } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Requetes = () => {
  const { user } = useAuth();
  const [requetes, setRequetes] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    eleve_id: "",
    type: "contestation",
    message: ""
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [reqRes, elevesRes] = await Promise.all([
        api.get("/requetes"),
        api.get("/eleves")
      ]);
      setRequetes(reqRes.data);
      setEleves(elevesRes.data);
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
      await api.post("/requetes", form);
      toast.success("Requête envoyée !");
      setForm({ eleve_id: "", type: "contestation", message: "" });
      setShowForm(false);
      fetchData();
    } catch {
      toast.error("Erreur lors de l'envoi !");
    }
  };

  const getStatutColor = (statut) => {
    if (statut === "traitée") return "bg-green-100 text-green-700";
    if (statut === "rejetée") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
    </div>
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mes Requêtes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
        >
          {showForm ? "Annuler" : "+ Nouvelle requête"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <select
              value={form.eleve_id}
              onChange={e => setForm({...form, eleve_id: e.target.value})}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            >
              <option value="">Sélectionner l'élève</option>
              {eleves.map(e => (
                <option key={e.id} value={e.id}>{e.user?.name}</option>
              ))}
            </select>

            <select
              value={form.type}
              onChange={e => setForm({...form, type: e.target.value})}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="contestation">Contestation</option>
              <option value="justification">Justification</option>
              <option value="autre">Autre</option>
            </select>

            <textarea
              value={form.message}
              onChange={e => setForm({...form, message: e.target.value})}
              placeholder="Votre message..."
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              required
            />

            <button
              type="submit"
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Envoyer
            </button>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {requetes.map(requete => (
          <div key={requete.id} className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between">
              <div>
                <span className="font-medium capitalize">{requete.type}</span>
                <p className="text-gray-600 mt-1">{requete.message}</p>
                {requete.reponse && (
                  <p className="mt-2 bg-gray-50 p-3 rounded-lg text-gray-600">
                    💬 Réponse : {requete.reponse}
                  </p>
                )}
              </div>
              <span className={`px-2 py-1 rounded text-sm h-fit ${getStatutColor(requete.statut)}`}>
                {requete.statut}
              </span>
            </div>
          </div>
        ))}
        {requetes.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-400">
            Aucune requête
          </div>
        )}
      </div>
    </div>
  );
};

export default Requetes;