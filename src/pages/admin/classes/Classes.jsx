import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { toast } from "react-toastify";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [niveaux, setNiveaux] = useState([]);
  const [form, setForm] = useState({ niveau_id: "", nom: "", annee_scolaire: "2025-2026" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [classesRes, niveauxRes] = await Promise.all([
      api.get("/classes"),
      api.get("/niveaux")
    ]);
    setClasses(classesRes.data);
    setNiveaux(niveauxRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/classes/${editId}`, form);
        toast.success("Classe modifiée !");
      } else {
        await api.post("/classes", form);
        toast.success("Classe créée !");
      }
      setForm({ niveau_id: "", nom: "", annee_scolaire: "2025-2026" });
      setEditId(null);
      fetchData();
    } catch {
      toast.error("Une erreur est survenue !");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (classe) => {
    setEditId(classe.id);
    setForm({
      niveau_id: classe.niveau_id,
      nom: classe.nom,
      annee_scolaire: classe.annee_scolaire
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette classe ?")) return;
    try {
      await api.delete(`/classes/${id}`);
      toast.success("Classe supprimée !");
      fetchData();
    } catch {
      toast.error("Erreur lors de la suppression !");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestion des Classes</h2>

      {/* Formulaire */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {editId ? "Modifier la classe" : "Ajouter une classe"}
        </h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <select
            value={form.niveau_id}
            onChange={e => setForm({...form, niveau_id: e.target.value})}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Sélectionner un niveau</option>
            {niveaux.map(n => (
              <option key={n.id} value={n.id}>{n.nom}</option>
            ))}
          </select>
          <input
            type="text"
            value={form.nom}
            onChange={e => setForm({...form, nom: e.target.value})}
            placeholder="Nom de la classe (ex: Terminale A)"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            value={form.annee_scolaire}
            onChange={e => setForm({...form, annee_scolaire: e.target.value})}
            placeholder="Année scolaire (ex: 2025-2026)"
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <div className="flex gap-2 md:col-span-3">
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
                onClick={() => { setEditId(null); setForm({ niveau_id: "", nom: "", annee_scolaire: "2025-2026" }); }}
                className="bg-gray-400 text-white px-6 py-2 rounded-lg"
              >
                Annuler
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Liste */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600">#</th>
              <th className="px-6 py-3 text-left text-gray-600">Nom</th>
              <th className="px-6 py-3 text-left text-gray-600">Niveau</th>
              <th className="px-6 py-3 text-left text-gray-600">Année</th>
              <th className="px-6 py-3 text-left text-gray-600">Élèves</th>
              <th className="px-6 py-3 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {classes.map((classe, index) => (
              <tr key={classe.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium">{classe.nom}</td>
                <td className="px-6 py-4">{classe.niveau?.nom}</td>
                <td className="px-6 py-4">{classe.annee_scolaire}</td>
                <td className="px-6 py-4">{classe.eleves?.length || 0}</td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(classe)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(classe.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {classes.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                  Aucune classe trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Classes;