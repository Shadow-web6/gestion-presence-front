import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { toast } from "react-toastify";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [form, setForm] = useState({
    name: "", email: "", password: "",
    role: "enseignant", telephone: "",
    eleve_id: "", lien: "père"
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    const [usersRes, elevesRes] = await Promise.all([
      api.get("/users"),
      api.get("/eleves")
    ]);
    setUsers(usersRes.data);
    setEleves(elevesRes.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Créer l'utilisateur
      const res = await api.post("/users", form);
      const newUser = res.data.user;

      // Si c'est un parent, lier à l'élève
      if (form.role === "parent" && form.eleve_id) {
        await api.post(`/eleves/${form.eleve_id}/parent`, {
          parent_id: newUser.id,
          lien: form.lien
        });
        toast.success("Parent créé et lié à l'élève !");
      } else {
        toast.success("Utilisateur créé !");
      }

      setForm({
        name: "", email: "", password: "",
        role: "enseignant", telephone: "",
        eleve_id: "", lien: "père"
      });
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Erreur !");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await api.delete(`/users/${id}`);
      toast.success("Utilisateur supprimé !");
      fetchData();
    } catch {
      toast.error("Erreur !");
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "bg-red-100 text-red-700",
      enseignant: "bg-blue-100 text-blue-700",
      eleve: "bg-green-100 text-green-700",
      parent: "bg-orange-100 text-orange-700",
    };
    return colors[role] || "bg-gray-100";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Gestion des Utilisateurs</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          {showForm ? "Annuler" : "+ Ajouter un utilisateur"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Nouvel utilisateur</h3>
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
              value={form.telephone}
              onChange={e => setForm({...form, telephone: e.target.value})}
              placeholder="Téléphone"
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={form.role}
              onChange={e => setForm({...form, role: e.target.value})}
              className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="enseignant">Enseignant</option>
              <option value="parent">Parent</option>
              <option value="admin">Admin</option>
            </select>

            {/* Champs supplémentaires si parent */}
            {form.role === "parent" && (
              <>
                <select
                  value={form.eleve_id}
                  onChange={e => setForm({...form, eleve_id: e.target.value})}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  required
                >
                  <option value="">Sélectionner l'élève concerné</option>
                  {eleves.map(e => (
                    <option key={e.id} value={e.id}>
                      {e.user?.name} — {e.classe?.nom} ({e.matricule})
                    </option>
                  ))}
                </select>

                <select
                  value={form.lien}
                  onChange={e => setForm({...form, lien: e.target.value})}
                  className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="père">Père</option>
                  <option value="mère">Mère</option>
                  <option value="tuteur">Tuteur</option>
                </select>

                {/* Aperçu de la liaison */}
                {form.eleve_id && (
                  <div className="md:col-span-2 bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <p className="text-orange-700 text-sm">
                      ✅ Ce parent sera lié comme <strong>{form.lien}</strong> de l'élève <strong>
                        {eleves.find(e => e.id === parseInt(form.eleve_id))?.user?.name}
                      </strong>
                    </p>
                  </div>
                )}
              </>
            )}

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Création..." : "Créer"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Liste par rôle */}
      {["admin", "enseignant", "parent", "eleve"].map(role => (
        <div key={role} className="mb-6">
          <h3 className="text-lg font-semibold mb-3 capitalize flex items-center gap-2">
            <span className={`px-2 py-1 rounded text-sm ${getRoleColor(role)}`}>{role}s</span>
          </h3>
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-600">#</th>
                  <th className="px-6 py-3 text-left text-gray-600">Nom</th>
                  <th className="px-6 py-3 text-left text-gray-600">Email</th>
                  <th className="px-6 py-3 text-left text-gray-600">Téléphone</th>
                  <th className="px-6 py-3 text-left text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.filter(u => u.role === role).map((user, index) => (
                  <tr key={user.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium">{user.name}</td>
                    <td className="px-6 py-4">{user.email}</td>
                    <td className="px-6 py-4">{user.telephone || "-"}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))}
                {users.filter(u => u.role === role).length === 0 && (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-gray-400">
                      Aucun {role} trouvé
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Users;