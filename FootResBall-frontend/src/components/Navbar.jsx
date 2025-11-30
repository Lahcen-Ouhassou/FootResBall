import React from "react";

export default function Navbar({ onLogout }) {
  return (
    <header className="w-full flex items-center  justify-between px-6 py-4 bg-white shadow">
      <h1 className="text-xl font-bold">FootResBall — Admin</h1>
      <div className="flex items-center gap-4">
        <button
          onClick={onLogout}
          className="bg-red-800 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
