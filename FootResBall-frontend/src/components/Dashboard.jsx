import { useEffect, useState } from "react";
import API from "../services/api";
import ReservationForm from "./ReservationForm";

export default function Dashboard() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    try {
      const { data } = await API.get("/reservations");
      setReservations(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reservations Dashboard</h1>
        <button
          onClick={logout}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>

      <ReservationForm refresh={fetchReservations} />

      <div className="mt-6">
        {reservations.map((r) => (
          <div key={r._id} className="border p-4 mb-2 rounded shadow">
            <p>
              <strong>{r.customerName}</strong> — Terrain {r.terrain} —{" "}
              {new Date(r.timeSlotStart).toLocaleString()}
            </p>
            <p>
              Duration: {r.duration}h | Price: {r.price} DH
            </p>

            <a
              href={`http://localhost:5000/api/reservations/pdf/${r._id}`}
              target="_blank"
              className="text-blue-500 underline"
            >
              Download PDF
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
