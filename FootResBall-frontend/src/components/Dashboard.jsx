import React, { useEffect, useState } from "react";
import { getReservations } from "../services/api";

export default function Dashboard() {
  const [counts, setCounts] = useState({
    total: 0,
    today: 0,
    paid: 0,
    unpaid: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const { data } = await getReservations();
        const total = data.length;
        const todayStr = new Date().toLocaleDateString("en-CA");
        const today = data.filter((r) => {
          const rDate = new Date(r.createdAt).toLocaleDateString("en-CA");
          return rDate === todayStr;
        }).length;
        const paid = data.filter((r) => r.paid).length;
        const unpaid = total - paid;
        setCounts({ total, today, paid, unpaid });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <div className="p-5">Loading...</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>

      <div
        className="
      grid 
      grid-cols-1       /* mobile */
      sm:grid-cols-2    /* ecran sghira */
      md:grid-cols-3    /*tablet  */
      lg:grid-cols-4    /* PC */
      gap-4
    "
      >
        <div className="p-4 bg-white rounded shadow">
          Total Reservations
          <br />
          <strong>{counts.total}</strong>
        </div>

        <div className="p-4 bg-white rounded shadow">
          Today
          <br />
          <strong>{counts.today}</strong>
        </div>

        <div className="p-4 bg-white rounded shadow">
          Paid
          <br />
          <strong>{counts.paid}</strong>
        </div>

        <div className="p-4 bg-white rounded shadow">
          Unpaid
          <br />
          <strong>{counts.unpaid}</strong>
        </div>
      </div>
    </div>
  );
}
