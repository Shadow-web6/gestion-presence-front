import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../../api/axios";

const QRCodeSeance = () => {
  const { seanceId } = useParams();
  const navigate = useNavigate();
  const [seance, setSeance] = useState(null);
  const [qrUrl, setQrUrl] = useState("");

  useEffect(() => {
    const fetchSeance = async () => {
      const res = await api.get(`/seances/${seanceId}`);
      setSeance(res.data);
      const token = res.data.qr_code_token;
      setQrUrl(`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${token}`);
    };
    fetchSeance();
  }, [seanceId]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">QR Code de la Séance</h2>
        <button
          onClick={() => navigate("/enseignant/seances")}
          className="bg-gray-400 text-white px-4 py-2 rounded-lg"
        >
          Retour
        </button>
      </div>

      <div className="bg-white p-8 rounded-xl shadow text-center max-w-md mx-auto">
        <p className="text-lg font-semibold mb-2">
          {seance?.programme?.matiere?.nom}
        </p>
        <p className="text-gray-500 mb-6">{seance?.date}</p>

        {qrUrl && (
          <img
            src={qrUrl}
            alt="QR Code"
            className="mx-auto mb-4 rounded-lg"
          />
        )}

        <p className="text-sm text-gray-400">
          Les élèves scannent ce QR code pour marquer leur présence
        </p>
      </div>
    </div>
  );
};

export default QRCodeSeance;