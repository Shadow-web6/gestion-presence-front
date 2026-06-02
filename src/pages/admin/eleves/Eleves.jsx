import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { toast } from "react-toastify";

const Eleves = () => {
  const [eleves, setEleves] = useState([]);
  const [classes, setClasses] = useState([]);
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    classe_id: "", matricule: "", date_naissance: ""
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [elevesRes, classesRes] = await Promise.all([
      api.get("/eleves"),
      api.get("/classes")
    ]);
    setEleves(elevesRes.data);
    setClasses(classesRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/eleves", form);
      toast.success("Élève créé avec succès !");
      setForm({ name: "", email: "", password: "", classe_id: "", matricule: "", date_naissance: "" });
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur lors de la création !");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet élève ?")) return;
    try {
      await api.delete(`/eleves/${id}`);
      toast.success("Élève supprimé !");
      fetchData();
    } catch {
      toast.error("Erreur lors de la suppression !");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Élèves</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? "Annuler" : "+ Ajouter un élève"}
        </button>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Nouvel élève</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="Nom complet"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="email"
              value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              placeholder="Email"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="password"
              value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              placeholder="Mot de passe"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <input
              type="text"
              value={form.matricule}
              onChange={e => setForm({...form, matricule: e.target.value})}
              placeholder="Matricule (ex: MAT-002)"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
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
            <input
              type="date"
              value={form.date_naissance}
              onChange={e => setForm({...form, date_naissance: e.target.value})}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer l'élève"}
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
              <th className="px-6 py-3 text-left text-gray-600">Nom</th>
              <th className="px-6 py-3 text-left text-gray-600">Matricule</th>
              <th className="px-6 py-3 text-left text-gray-600">Classe</th>
              <th className="px-6 py-3 text-left text-gray-600">Email</th>
              <th className="px-6 py-3 text-left text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {eleves.map((eleve, index) => (
              <tr key={eleve.id} className="border-t hover:bg-gray-50">
                <td className="px-6 py-4">{index + 1}</td>
                <td className="px-6 py-4 font-medium">{eleve.user?.name}</td>
                <td className="px-6 py-4">{eleve.matricule}</td>
                <td className="px-6 py-4">{eleve.classe?.nom}</td>
                <td className="px-6 py-4">{eleve.user?.email}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => handleDelete(eleve.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
            {eleves.length === 0 && (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                  Aucun élève trouvé
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Eleves;