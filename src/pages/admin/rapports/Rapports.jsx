import { useState, useEffect } from "react";
import api from "../../../api/axios";
import { toast } from "react-toastify";

const Rapports = () => {
  const [classes, setClasses] = useState([]);
  const [eleves, setEleves] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    classe_id: "",
    eleve_id: "",
    date_debut: "",
    date_fin: ""
  });

  useEffect(() => {
    const fetchData = async () => {
      const [classesRes, elevesRes] = await Promise.all([
        api.get("/classes"),
        api.get("/eleves")
      ]);
      setClasses(classesRes.data);
      setEleves(elevesRes.data);
    };
    fetchData();
  }, []);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/rapports/statistiques?${params}`);
      setStats(res.data);
    } catch {
      toast.error("Erreur lors du chargement !");
    } finally {
      setLoading(false);
    }
  };

  const handleExportPdf = async () => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/rapports/pdf?${params}`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'rapport-presence.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("PDF téléchargé !");
    } catch {
      toast.error("Erreur lors de l'export !");
    }
  };

  const filteredEleves = filters.classe_id
    ? eleves.filter(e => parseInt(e.classe_id) === parseInt(filters.classe_id))
    : eleves;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Rapports de Présence</h2>

      {/* Filtres */}
      <div className="bg-white p-6 rounded-xl shadow mb-6">
        <h3 className="text-lg font-semibold mb-4">Filtres</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select
            value={filters.classe_id}
            onChange={e => setFilters({...filters, classe_id: e.target.value, eleve_id: ""})}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Toutes les classes</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.nom}</option>
            ))}
          </select>

          <select
            value={filters.eleve_id}
            onChange={e => setFilters({...filters, eleve_id: e.target.value})}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Tous les élèves</option>
            {filteredEleves.map(e => (
              <option key={e.id} value={e.id}>{e.user?.name}</option>
            ))}
          </select>

          <input
            type="date"
            value={filters.date_debut}
            onChange={e => setFilters({...filters, date_debut: e.target.value})}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Date début"
          />

          <input
            type="date"
            value={filters.date_fin}
            onChange={e => setFilters({...filters, date_fin: e.target.value})}
            className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Date fin"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <button
            onClick={handleSearch}
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Chargement..." : "🔍 Générer le rapport"}
          </button>
          {stats && (
            <button
              onClick={handleExportPdf}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700"
            >
              📄 Exporter PDF
            </button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      {stats && (
        <>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <p className="text-gray-500 text-sm">Total</p>
              <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <p className="text-gray-500 text-sm">Présents</p>
              <p className="text-3xl font-bold text-green-600">{stats.presents}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <p className="text-gray-500 text-sm">Absents</p>
              <p className="text-3xl font-bold text-red-600">{stats.absents}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <p className="text-gray-500 text-sm">Retards</p>
              <p className="text-3xl font-bold text-yellow-600">{stats.retards}</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow text-center">
              <p className="text-gray-500 text-sm">Taux présence</p>
              <p className="text-3xl font-bold text-purple-600">{stats.taux_presence}%</p>
            </div>
          </div>

          {/* Tableau détaillé */}
          <div className="bg-white rounded-xl shadow overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-gray-600">#</th>
                  <th className="px-6 py-3 text-left text-gray-600">Élève</th>
                  <th className="px-6 py-3 text-left text-gray-600">Classe</th>
                  <th className="px-6 py-3 text-left text-gray-600">Matière</th>
                  <th className="px-6 py-3 text-left text-gray-600">Date</th>
                  <th className="px-6 py-3 text-left text-gray-600">Statut</th>
                </tr>
              </thead>
              <tbody>
                {stats.presences.map((p, index) => (
                  <tr key={p.id} className="border-t hover:bg-gray-50">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4">{p.eleve?.user?.name}</td>
                    <td className="px-6 py-4">{p.eleve?.classe?.nom}</td>
                    <td className="px-6 py-4">{p.seance?.programme?.matiere?.nom}</td>
                    <td className="px-6 py-4">{p.seance?.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-sm font-medium
                        ${p.statut === 'present' ? 'bg-green-100 text-green-700' :
                          p.statut === 'absent' ? 'bg-red-100 text-red-700' :
                          p.statut === 'retard' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-blue-100 text-blue-700'}`}>
                        {p.statut}
                      </span>
                    </td>
                  </tr>
                ))}
                {stats.presences.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-4 text-center text-gray-400">
                      Aucune donnée trouvée
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default Rapports;