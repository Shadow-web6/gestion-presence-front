import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { toast } from "react-toastify";

const Requetes = () => {
  const [requetes, setRequetes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reponse, setReponse] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const fetchRequetes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/requetes");
      setRequetes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequetes(); }, []);

  const handleTraiter = async (id, statut) => {
    try {
      await api.post(`/requetes/${id}/traiter`, {
        statut,
        reponse: selectedId === id ? reponse : ""
      });
      toast.success(`Requête ${statut} !`);
      setSelectedId(null);
      setReponse("");
      fetchRequetes();
    } catch {
      toast.error("Erreur !");
    }
  };

  const getTypeColor = (type) => {
    if (type === "contestation") return "bg-red-100 text-red-700";
    if (type === "justification") return "bg-blue-100 text-blue-700";
    return "bg-gray-100 text-gray-700";
  };

  const getStatutColor = (statut) => {
    if (statut === "traitée") return "bg-green-100 text-green-700";
    if (statut === "rejetée") return "bg-red-100 text-red-700";
    return "bg-yellow-100 text-yellow-700";
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Requêtes des Élèves/Parents</h2>

      <div className="space-y-4">
        {requetes.map((requete) => (
          <div key={requete.id} className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-start mb-3">
              <div>
                <div className="flex gap-2 mb-2">
                  <span className={`px-2 py-1 rounded text-sm ${getTypeColor(requete.type)}`}>
                    {requete.type}
                  </span>
                  <span className={`px-2 py-1 rounded text-sm ${getStatutColor(requete.statut)}`}>
                    {requete.statut}
                  </span>
                </div>
                <h3 className="font-semibold">{requete.eleve?.user?.name}</h3>
                <p className="text-gray-600 mt-1">📝 {requete.message}</p>
                <p className="text-gray-400 text-sm mt-1">
                  Par : {requete.auteur?.name}
                </p>
              </div>
            </div>

            {requete.statut === "en_attente" && (
              <div className="border-t pt-4">
                <textarea
                  placeholder="Réponse..."
                  value={selectedId === requete.id ? reponse : ""}
                  onFocus={() => setSelectedId(requete.id)}
                  onChange={e => setReponse(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => handleTraiter(requete.id, "traitée")}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    ✅ Traiter
                  </button>
                  <button
                    onClick={() => handleTraiter(requete.id, "rejetée")}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    ❌ Rejeter
                  </button>
                </div>
              </div>
            )}

            {requete.reponse && (
              <p className="mt-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                💬 {requete.reponse}
              </p>
            )}
          </div>
        ))}

        {requetes.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-400">
            Aucune requête trouvée
          </div>
        )}
      </div>
    </div>
  );
};

export default Requetes;