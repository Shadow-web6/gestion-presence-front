import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { toast } from "react-toastify";

const Matieres = () => {
  const [matieres, setMatieres] = useState([]);
  const [form, setForm] = useState({ nom: "", code: "" });
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchMatieres = async () => {
    const res = await api.get("/matieres");
    setMatieres(res.data);
  };

  useEffect(() => { fetchMatieres(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (editId) {
        await api.put(`/matieres/${editId}`, form);
        toast.success("Matière modifiée !");
      } else {
        await api.post("/matieres", form);
        toast.success("Matière créée !");
      }
      setForm({ nom: "", code: "" });
      setEditId(null);
      fetchMatieres();
    } catch {
      toast.error("Une erreur est survenue !");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (matiere) => {
    setEditId(matiere.id);
    setForm({ nom: matiere.nom, code: matiere.code });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cette matière ?")) return;
    try {
      await api.delete(`/matieres/${id}`);
      toast.success("Matière supprimée !");
      fetchMatieres();
    } catch {
      toast.error("Erreur lors de la suppression !");
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Gestion des Matières</h2>

      {/* Formulaire */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">
          {editId ? "Modifier la matière" : "Ajouter une matière"}
        </h3>
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={form.nom}
            onChange={e => setForm({...form, nom: e.target.value})}
            placeholder="Nom (ex: Mathématiques)"
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            value={form.code}
            onChange={e => setForm({...form, code: e.target.value})}
            placeholder="Code (ex: MATH)"
            className="w-32 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              onClick={() => { setEditId(null); setForm({ nom: "", code: "" }); }}
              className="bg-gray-400 text-white px-6 py-2 rounded-lg"
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
              <th className="px-6 py-3 text-left text-gray-600">Code</th>
              <th className="px-6 py-3 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {matieres.map((matiere, index) => (
              <tr key={matiere.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium">{matiere.nom}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                    {matiere.code}
                  </span>
                </td>
                <td className="px-6 py-4 flex gap-2">
                  <button
                    onClick={() => handleEdit(matiere)}
                    className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500"
                  >
                    Modifier
                  </button>
                  <button
                    onClick={() => handleDelete(matiere.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {matieres.length === 0 && (
              <tr>
                <td colSpan="4" className="px-6 py-4 text-center text-gray-400">
                  Aucune matière trouvée
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Matieres;