import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { toast } from "react-toastify";

const Programmes = () => {
  const [programmes, setProgrammes] = useState([]);
  const [classes, setClasses] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [enseignants, setEnseignants] = useState([]);
  const [form, setForm] = useState({
    classe_id: "", matiere_id: "", enseignant_id: "",
    jour: "", heure_debut: "", heure_fin: "", salle: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [progRes, classesRes, matieresRes, usersRes] = await Promise.all([
      api.get("/programmes"),
      api.get("/classes"),
      api.get("/matieres"),
      api.get("/users")
    ]);
    setProgrammes(progRes.data);
    setClasses(classesRes.data);
    setMatieres(matieresRes.data);
    setEnseignants(usersRes.data.filter(u => u.role === "enseignant"));
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/programmes", form);
      toast.success("Programme créé !");
      setForm({
        classe_id: "", matiere_id: "", enseignant_id: "",
        jour: "", heure_debut: "", heure_fin: "", salle: ""
      });
      setShowForm(false);
      fetchData();
    } catch {
      toast.error("Erreur lors de la création !");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce programme ?")) return;
    try {
      await api.delete(`/programmes/${id}`);
      toast.success("Programme supprimé !");
      fetchData();
    } catch {
      toast.error("Erreur lors de la suppression !");
    }
  };

  const jours = ["Lundi", "Mardi", "Mercredi", "Jeudi", "Vendredi", "Samedi"];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Programmes</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? "Annuler" : "+ Ajouter un programme"}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Nouveau programme</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <select
              value={form.classe_id}
              onChange={e => setForm({...form, classe_id: e.target.value})}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une classe</option>
              {classes.map(c => (
                <option key={c.id} value={c.id}>{c.nom}</option>
              ))}
            </select>

            <select
              value={form.matiere_id}
              onChange={e => setForm({...form, matiere_id: e.target.value})}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner une matière</option>
              {matieres.map(m => (
                <option key={m.id} value={m.id}>{m.nom}</option>
              ))}
            </select>

            <select
              value={form.enseignant_id}
              onChange={e => setForm({...form, enseignant_id: e.target.value})}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un enseignant</option>
              {enseignants.map(e => (
                <option key={e.id} value={e.id}>{e.name}</option>
              ))}
            </select>

            <select
              value={form.jour}
              onChange={e => setForm({...form, jour: e.target.value})}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionner un jour</option>
              {jours.map(j => (
                <option key={j} value={j}>{j}</option>
              ))}
            </select>

            <input
              type="time"
              value={form.heure_debut}
              onChange={e => setForm({...form, heure_debut: e.target.value})}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="time"
              value={form.heure_fin}
              onChange={e => setForm({...form, heure_fin: e.target.value})}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

            <input
              type="text"
              value={form.salle}
              onChange={e => setForm({...form, salle: e.target.value})}
              placeholder="Salle (ex: Salle A1)"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer le programme"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-gray-600">#</th>
              <th className="px-6 py-3 text-left text-gray-600">Classe</th>
              <th className="px-6 py-3 text-left text-gray-600">Matière</th>
              <th className="px-6 py-3 text-left text-gray-600">Enseignant</th>
              <th className="px-6 py-3 text-left text-gray-600">Jour</th>
              <th className="px-6 py-3 text-left text-gray-600">Horaire</th>
              <th className="px-6 py-3 text-left text-gray-600">Salle</th>
              <th className="px-6 py-3 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {programmes.map((prog, index) => (
              <tr key={prog.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4">{prog.classe?.nom}</td>
                <td className="px-6 py-4">{prog.matiere?.nom}</td>
                <td className="px-6 py-4">{prog.enseignant?.name}</td>
                <td className="px-6 py-4">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-sm">
                    {prog.jour}
                  </span>
                </td>
                <td className="px-6 py-4">{prog.heure_debut} - {prog.heure_fin}</td>
                <td className="px-6 py-4">{prog.salle || "-"}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(prog.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {programmes.length === 0 && (
              <tr>
                <td colSpan="8" className="px-6 py-4 text-center text-gray-400">
                  Aucun programme trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Programmes;