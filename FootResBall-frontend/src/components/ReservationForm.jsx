import React, { useEffect, useState } from "react";
import {
  addReservation,
  getAvailableSlots,
  updateReservation,
  getReservation,
} from "../services/api";

export default function ReservationForm({ refresh, editId, onDone }) {
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

  useEffect(() => {
    if (editId) {
      // load reservation to edit
      (async () => {
        try {
          const { data } = await getReservation(editId);
          // normalize date to yyyy-mm-dd for input
          const isoDate = new Date(data.date).toISOString().slice(0, 10);
          setForm({
            ...form,
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
    // eslint-disable-next-line
  }, [editId]);

  useEffect(() => {
    // fetch available slots when date/terrain/duration change
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
        setSlots([]);
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
      } else {
        await addReservation(form);
      }
      refresh?.();
      onDone?.();
      // reset
      if (!editId)
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
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white p-4 rounded shadow max-w-md"
    >
      <h3 className="font-bold mb-2">
        {editId ? "Edit Reservation" : "Add Reservation"}
      </h3>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <input
        name="customerName"
        value={form.customerName}
        onChange={handleChange}
        placeholder="Customer Name"
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        name="phoneNumber"
        value={form.phoneNumber}
        onChange={handleChange}
        placeholder="Phone Number"
        className="w-full p-2 mb-2 border rounded"
      />
      <input
        name="idCard"
        value={form.idCard}
        onChange={handleChange}
        placeholder="ID Card"
        className="w-full p-2 mb-2 border rounded"
      />
      <select
        name="terrain"
        value={form.terrain}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value="A">Terrain A</option>
        <option value="B">Terrain B</option>
        <option value="C">Terrain C</option>
      </select>
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
      />
      <select
        name="duration"
        value={form.duration}
        onChange={handleChange}
        className="w-full p-2 mb-2 border rounded"
      >
        <option value={1}>1 hour</option>
        <option value={2}>2 hours</option>
      </select>

      <label className="block mb-2">Select time</label>
      {loadingSlots ? (
        <div>Loading slots...</div>
      ) : (
        <select
          name="timeSlotStart"
          value={form.timeSlotStart}
          onChange={handleChange}
          className="w-full p-2 mb-2 border rounded"
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
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        {editId ? "Update" : "Add Reservation"}
      </button>
    </form>
  );
}
