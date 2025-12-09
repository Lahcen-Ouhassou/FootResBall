import { useState } from "react";
import { signup } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-white">Create Admin</h2>

        {error && <p className="text-red-400 text-sm mb-3">{error}</p>}

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className="w-full p-2 mb-3 bg-gray-700 text-white"
          placeholder="Name"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full p-2 mb-3 bg-gray-700 text-white "
          placeholder="Email"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          className="w-full p-2 mb-3 bg-gray-700 text-white "
          placeholder="Password"
        />

        <p className="text-white text-sm mb-4">
          Already have an account?{" "}
          <span
            className="text-blue-400 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Login
          </span>
        </p>

        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 cursor-pointer">
          Create Admin
        </button>
      </form>
    </div>
  );
}
