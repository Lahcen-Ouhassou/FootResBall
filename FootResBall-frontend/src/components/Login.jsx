import { useState } from "react";
import { login } from "../services/api";

export default function Login({ setLoggedIn }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      setLoggedIn(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error logging in");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-sm">
        <h2 className="text-white text-xl font-bold mb-4">Login</h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 mb-3 bg-gray-700 text-white rounded"
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 mb-4 bg-gray-700 text-white rounded"
        />

        <button className="w-full bg-black text-white py-2 rounded">
          Login
        </button>
      </div>
    </div>
  );
}
