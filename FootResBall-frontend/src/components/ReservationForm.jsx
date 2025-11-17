import { useState } from "react";
import API from "../services/api";

export default function ReservationForm({ refresh }) {
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

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/reservations", form);
      refresh();
      setForm({ ...form, customerName: "", phoneNumber: "", idCard: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Error creating reservation");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gray-50 p-4 rounded shadow-md w-full max-w-md"
    >
      <h2 className="font-bold mb-2">Add Reservation</h2>
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
      <input
        type="time"
        name="timeSlotStart"
        value={form.timeSlotStart}
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
      <label className="flex items-center mb-2">
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
        className="bg-green-500 text-white py-2 px-4 rounded"
      >
        Add Reservation
      </button>
    </form>
  );
}
