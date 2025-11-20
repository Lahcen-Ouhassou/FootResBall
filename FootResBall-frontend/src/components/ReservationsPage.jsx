import React, { useEffect, useState } from "react";
import { getReservations, deleteReservation } from "../services/api";
import ReservationForm from "./ReservationForm";

export default function ReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);

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

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h3 className="font-semibold mb-2">List</h3>
          {loading ? (
            <div>Loading...</div>
          ) : (
            reservations.map((r) => (
              <div key={r._id} className="border p-3 mb-3 rounded bg-white">
                <div className="flex justify-between">
                  <div>
                    <strong>{r.customerName}</strong> — Terrain {r.terrain} —{" "}
                    {new Date(r.timeSlotStart).toLocaleString()}
                    <div>
                      Duration: {r.duration}h | Price: {r.price} DH
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingId(r._id)}
                      className="px-2 py-1 bg-yellow-400 rounded"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(r._id)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>

                    <button
                      onClick={() => handleDownload(r._id)}
                      className="px-2 py-1 bg-blue-500 text-white rounded"
                    >
                      PDF
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div>
          <h3 className="font-semibold mb-2">
            {editingId ? "Edit reservation" : "Add new"}
          </h3>
          <ReservationForm
            refresh={load}
            editId={editingId}
            onDone={() => setEditingId(null)}
          />
        </div>
      </div>
    </div>
  );
}
