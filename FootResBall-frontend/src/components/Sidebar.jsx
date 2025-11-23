import React from "react";
import { NavLink } from "react-router-dom";

export default function Sidebar() {
  const linkClass = ({ isActive }) =>
    "block px-4 py-2 rounded " +
    (isActive ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100");

  return (
    <aside className="w-64 bg-white  min-h-screen p-4">
      <nav className="flex flex-col gap-2">
        <NavLink to="/" className={linkClass} end>
          Dashboard
        </NavLink>
        <NavLink to="/reservations" className={linkClass}>
          All Reservations
        </NavLink>
        <NavLink to="/reserve" className={linkClass}>
          Add Reservation
        </NavLink>
      </nav>
    </aside>
  );
}
