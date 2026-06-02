import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { toast } from "react-toastify";

const Niveaux = () => {
  const [niveaux, setNiveaux] = useState([]);
  const [nom, setNom] = useState("");
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchNiveaux = async () => {
    const res = await api.get("/niveaux");
    setNiveaux(res.data);
  };

  useEffect(() => { fetchNiveaux(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/niveaux/${editId}`, { nom });
        toast.success("Niveau modifié !");
      } else {
        await api.post("/niveaux", { nom });
        toast.success("Niveau créé !");
      }
      setNom("");
      setEditId(null);
      fetchNiveaux();
    } catch {
      toast.error("Une erreur est survenue !");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (niveau) => {
    setEditId(niveau.id);
    setNom(niveau.nom);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce niveau ?")) return;
    try {
      await api.delete(`/niveaux/${id}`);
      toast.success("Niveau supprimé !");
      fetchNiveaux();
    } catch {
      toast.error("Erreur lors de la suppression !");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestion des Niveaux</h2>

      {/* Formulaire */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {editId ? "Modifier le niveau" : "Ajouter un niveau"}
        </h3>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={nom}
            onChange={e => setNom(e.target.value)}
            placeholder="Nom du niveau (ex: Terminale)"
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {editId ? "Modifier" : "Ajouter"}
          </button>
          {editId && (
            <button
              type="button"
              onClick={() => { setEditId(null); setNom(""); }}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg hover:bg-gray-500"
            >
              Annuler
            </button>
          )}
        </form>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600">#</th>
              <th className="px-6 py-3 text-left text-gray-600">Nom</th>
              <th className="px-6 py-3 text-left text-gray-600">Classes</th>
              <th className="px-6 py-3 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {niveaux.map((niveau, index) => (
              <tr key={niveau.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium">{niveau.nom}</td>
                <td className="px-6 py-4">{niveau.classes?.length || 0}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(niveau)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(niveau.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {niveaux.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                  Aucun niveau trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Niveaux;