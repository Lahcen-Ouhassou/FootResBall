import React, { useEffect, useState } from "react";
import {
  addReservation,
  getAvailableSlots,
  updateReservation,
  getReservation,
} from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ReservationForm({ refresh, editId, onDone }) {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    customerName: "",
    phoneNumber: "",
    idCard: "",
    terrain: "A",
    date: "",
    timeSlotStart: "",
    duration: 1,
    paid: false,
  });

  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (editId) {
      (async () => {
        try {
          const { data } = await getReservation(editId);
          const isoDate = new Date(data.date).toISOString().slice(0, 10);

          setForm({
            customerName: data.customerName || "",
            phoneNumber: data.phoneNumber || "",
            idCard: data.idCard || "",
            terrain: data.terrain || "A",
            date: isoDate,
            timeSlotStart: data.timeSlotStart
              ? new Date(data.timeSlotStart).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : "",
            duration: data.duration || 1,
            paid: !!data.paid,
          });
        } catch (err) {
          console.error(err);
        }
      })();
    }
  }, [editId]);

  useEffect(() => {
    async function loadSlots() {
      if (!form.date || !form.terrain) return setSlots([]);

      setLoadingSlots(true);
      try {
        const { data } = await getAvailableSlots({
          date: form.date,
          terrain: form.terrain,
          duration: form.duration,
        });

        setSlots(data.availableSlots || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSlots(false);
      }
    }
    loadSlots();
  }, [form.date, form.terrain, form.duration]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!form.timeSlotStart) throw new Error("Please select a time slot");

      if (editId) {
        await updateReservation(editId, form);
        setSuccess("Reservation updated successfully!");
        setTimeout(() => {
          navigate("/reservations"); // ⬅️ يرجع لصفحة All Reservations
        }, 1200);
      } else {
        await addReservation(form);
        setSuccess("Reservation added successfully!");
        setForm({
          customerName: "",
          phoneNumber: "",
          idCard: "",
          terrain: "A",
          date: "",
          timeSlotStart: "",
          duration: 1,
          paid: false,
        });
      }

      refresh?.();
      onDone?.();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error");
    }
  };
  const today = new Date().toISOString().split("T")[0];
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-100 p-4 sm:p-6 md:p-10">
      {/* Titre */}
      <h2 className="text-xl font-bold mb-4">
        {editId ? "Edit Reservation" : "Add Reservation"}
      </h2>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 shadow w-full max-w-md"
      >
        {error && <div className="text-red-500 mb-2">{error}</div>}
        {success && <div className="text-green-600 mb-2">{success}</div>}

        <input
          name="customerName"
          value={form.customerName}
          onChange={handleChange}
          placeholder="Customer Name"
          className="w-full p-2 mb-2 border "
        />

        <input
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
          placeholder="Phone Number"
          className="w-full p-2 mb-2 border "
        />

        <input
          name="idCard"
          value={form.idCard}
          onChange={handleChange}
          placeholder="ID Card"
          className="w-full p-2 mb-2 border "
        />

        <select
          name="terrain"
          value={form.terrain}
          onChange={handleChange}
          className="w-full p-2 mb-2 border "
        >
          <option value="A">Terrain A</option>
          <option value="B">Terrain B</option>
          <option value="C">Terrain C</option>
        </select>

        <input
          type="date"
          name="date"
          min={today}
          value={form.date}
          onChange={handleChange}
          className="w-full p-2 mb-2 border "
        />

        <select
          name="duration"
          value={form.duration}
          onChange={handleChange}
          className="w-full p-2 mb-2 border "
        >
          <option value={1}>1 hour</option>
          <option value={2}>2 hours</option>
        </select>

        {loadingSlots ? (
          <div>Loading slots...</div>
        ) : (
          <select
            name="timeSlotStart"
            value={form.timeSlotStart}
            onChange={handleChange}
            className="w-full p-2 mb-2 border "
          >
            <option value="">Select time</option>
            {slots.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}

        <label className="flex items-center mb-3">
          <input
            type="checkbox"
            name="paid"
            checked={form.paid}
            onChange={handleChange}
            className="mr-2"
          />
          Paid
        </label>

        <button
          type="submit"
          className="text-white px-4 py-2  bg-blue-600 hover:bg-blue-700 cursor-pointer"
        >
          {editId ? "Update" : "Add Reservation"}
        </button>
      </form>
    </div>
  );
}
