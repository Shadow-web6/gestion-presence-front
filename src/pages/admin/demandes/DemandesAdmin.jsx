import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { toast } from "react-toastify";

const DemandesAdmin = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentaire, setCommentaire] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const res = await api.get("/demandes");
      setDemandes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDemandes(); }, []);

  const handleTraiter = async (id, statut) => {
    try {
      await api.post(`/demandes/${id}/traiter`, {
        statut,
        commentaire: selectedId === id ? commentaire : ""
      });
      toast.success(`Demande ${statut} !`);
      setSelectedId(null);
      setCommentaire("");
      fetchDemandes();
    } catch {
      toast.error("Erreur !");
    }
  };

  const getStatutColor = (statut) => {
    if (statut === "approuvée") return "bg-green-100 text-green-700";
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
      <h2 className="text-2xl font-bold mb-6">Demandes de Permission</h2>

      <div className="space-y-4">
        {demandes.map((demande, index) => (
          <div key={demande.id} className="bg-white p-6 rounded-xl shadow">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">
                  {demande.eleve?.user?.name}
                  <span className="text-gray-400 text-sm ml-2">
                    {demande.eleve?.classe?.nom}
                  </span>
                </h3>
                <p className="text-gray-600 mt-1">
                  📅 {demande.date_debut} → {demande.date_fin}
                </p>
                <p className="text-gray-600 mt-1">
                  📝 {demande.motif}
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Demandé par : {demande.demandeur?.name}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatutColor(demande.statut)}`}>
                {demande.statut}
              </span>
            </div>

            {demande.statut === "en_attente" && (
              <div className="mt-4 border-t pt-4">
                <textarea
                  placeholder="Commentaire (optionnel)..."
                  value={selectedId === demande.id ? commentaire : ""}
                  onFocus={() => setSelectedId(demande.id)}
                  onChange={e => setCommentaire(e.target.value)}
                  className="w-full border rounded-lg px-4 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={2}
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => handleTraiter(demande.id, "approuvée")}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                  >
                    ✅ Approuver
                  </button>
                  <button
                    onClick={() => handleTraiter(demande.id, "rejetée")}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                  >
                    ❌ Rejeter
                  </button>
                </div>
              </div>
            )}

            {demande.commentaire && (
              <p className="mt-3 text-gray-600 bg-gray-50 p-3 rounded-lg">
                💬 {demande.commentaire}
              </p>
            )}
          </div>
        ))}

        {demandes.length === 0 && (
          <div className="bg-white p-6 rounded-xl shadow text-center text-gray-400">
            Aucune demande de permission
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandesAdmin;