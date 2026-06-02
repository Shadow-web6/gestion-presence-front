import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";
import { toast } from "react-toastify";

const MarquerPresence = () => {
  const { seanceId } = useParams();
  const navigate = useNavigate();
  const [seance, setSeance] = useState(null);
  const [eleves, setEleves] = useState([]);
  const [presences, setPresences] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const seanceRes = await api.get(`/seances/${seanceId}`);
        setSeance(seanceRes.data);

        const classeId = seanceRes.data.programme?.classe_id;
        console.log("Seance data:", seanceRes.data);
        console.log("Programme:", seanceRes.data.programme);
        console.log("Classe ID:", classeId);
        console.log("Classe ID:", classeId);

        if (classeId) {
          // Charger les élèves directement
          const elevesRes = await api.get("/eleves");
          const elevesClasse = elevesRes.data.filter(e => 
            parseInt(e.classe_id) === parseInt(classeId)
          );
          setEleves(elevesClasse);

          // Charger les présences existantes
          const presencesRes = await api.get(`/presences/seance/${seanceId}`);
          const initPresences = {};
          elevesClasse.forEach(e => {
              const existante = presencesRes.data.find(p => p.eleve_id === e.id);
              initPresences[e.id] = existante ? existante.statut : "present";
          });
          setPresences(initPresences);
        }
      } catch (err) {
        console.error("Erreur:", err);
      }
    };
    fetchData();
  }, [seanceId]);

  const handleStatut = (eleveId, statut) => {
    setPresences(prev => ({...prev, [eleveId]: statut}));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = Object.entries(presences).map(([eleve_id, statut]) => ({
        eleve_id: parseInt(eleve_id),
        statut
      }));

      await api.post("/presences/marquer", {
        seance_id: parseInt(seanceId),
        presences: data
      });

      toast.success("Présences enregistrées !");
      navigate("/enseignant/seances");
    } catch {
      toast.error("Erreur lors de l'enregistrement !");
    } finally {
      setLoading(false);
    }
  };

  const statutColors = {
    present: "bg-green-500",
    absent: "bg-red-500",
    retard: "bg-yellow-500",
    "excusé": "bg-blue-500"
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">Marquage de Présence</h2>
          <p className="text-gray-500">
            {seance?.programme?.matiere?.nom} — {seance?.date}
          </p>
        </div>
        <button
          onClick={() => navigate("/enseignant/seances")}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg"
        >
          Retour
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden mb-6">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600">#</th>
              <th className="px-6 py-3 text-left text-gray-600">Élève</th>
              <th className="px-6 py-3 text-left text-gray-600">Statut</th>
            </tr>
          </thead>
          <tbody>
            {eleves.map((eleve, index) => (
              <tr key={eleve.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium">{eleve.user?.name}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {["present", "absent", "retard", "excusé"].map(statut => (
                      <button
                        key={statut}
                        onClick={() => handleStatut(eleve.id, statut)}
                        className={`px-3 py-1 rounded text-white text-sm capitalize transition
                          ${presences[eleve.id] === statut
                            ? statutColors[statut]
                            : "bg-gray-200 text-gray-600"
                          }`}
                      >
                        {statut}
                      </button>
                    ))}
                  </div>
                </td>
              </tr>
            ))}
            {eleves.length === 0 && (
              <tr>
                <td colSpan="3" className="px-6 py-4 text-center text-gray-400">
                  Aucun élève dans cette classe
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {eleves.length > 0 && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 disabled:opacity-50 text-lg font-semibold"
        >
          {loading ? "Enregistrement..." : "✅ Enregistrer les présences"}
        </button>
      )}
    </div>
  );
};

export default MarquerPresence;