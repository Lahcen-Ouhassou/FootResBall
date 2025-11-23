import React, { useEffect, useState } from "react";
import {
  getReservations,
  deleteReservation,
  getReservationPDF,
} from "../services/api";
import ReservationForm from "./ReservationForm";
import { useNavigate } from "react-router-dom";

export default function ReservationsPage() {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await getReservations();
      setReservations(data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure to delete?")) return;
    await deleteReservation(id);
    load();
  };

  const handleDownload = async (id) => {
    try {
      const res = await getReservationPDF(id);

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.download = "reservation.pdf";
      link.click();
    } catch (err) {
      console.error(err);
      alert("Error downloading PDF");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">All Reservations</h2>

      <div className="grid grid-cols-1 gap-6">
        {loading ? (
          <div>Loading...</div>
        ) : (
          reservations.map((r) => (
            <div key={r._id} className="border p-3 mb-3 rounded bg-white">
              <div className="flex justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <strong>{r.customerName}</strong>

                    {/* IF paid → show green Paid */}
                    {r.paid ? (
                      <span className="px-2 py-1 bg-green-500 text-white text-xs rounded">
                        Paid
                      </span>
                    ) : (
                      <span className="px-2 py-1 bg-red-500 text-white text-xs rounded">
                        UnPaid
                      </span>
                    )}
                  </div>
                  Terrain {r.terrain}
                  <div>{new Date(r.timeSlotStart).toLocaleString()}</div>
                  <div>{new Date(r.timeSlotEnd).toLocaleString()}</div>
                  <div>
                    Duration: {r.duration}h | Price: {r.price} DH
                  </div>
                </div>

                <div className="flex gap-2 items-start">
                  <button
                    onClick={() => navigate(`/reserve-edit/${r._id}`)}
                    className=" bg-blue-600   hover:bg-blue-700
 px-3 py-1 text-white rounded  cursor-pointer"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(r._id)}
                    className="px-2 py-1 bg-blue-600   hover:bg-blue-700
 text-white rounded  cursor-pointer"
                  >
                    Delete
                  </button>

                  <button
                    className="px-2 py-1  bg-blue-600   hover:bg-blue-700
 p-4 text-white rounded  cursor-pointer"
                    onClick={() => handleDownload(r._id)}
                  >
                    PDF
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
