import { useEffect, useState } from "react";
import { api } from "../../services/api";

const STATUSES = ["pending", "confirmed", "completed", "cancelled"];

export default function AdminVisits() {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.get("/visits")
      .then((res) => setVisits(res.data))
      .catch(() => setError("Connect the backend and log in as admin to view visit requests."))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/visits/${id}`, { status });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900">Visit Requests</h1>
      <p className="mt-1 text-sm text-charcoal-500">Scheduled property visits from customers.</p>

      {error && <p className="mt-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">{error}</p>}

      <div className="mt-6 overflow-x-auto rounded-2xl border border-charcoal-100">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-charcoal-50 text-xs font-semibold uppercase tracking-wide text-charcoal-500">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Property</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Time</th>
              <th className="p-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} className="p-6 text-center text-charcoal-400">Loading...</td></tr>
            ) : visits.length === 0 ? (
              <tr><td colSpan={5} className="p-6 text-center text-charcoal-400">No visit requests yet.</td></tr>
            ) : (
              visits.map((v) => (
                <tr key={v._id} className="border-t border-charcoal-100">
                  <td className="p-3 font-medium text-charcoal-800">{v.name} <span className="block text-xs font-normal text-charcoal-400">{v.phone}</span></td>
                  <td className="p-3 text-charcoal-600">{v.propertyId?.title || "—"}</td>
                  <td className="p-3 text-charcoal-600">{new Date(v.preferredDate).toLocaleDateString()}</td>
                  <td className="p-3 text-charcoal-600">{v.preferredTime}</td>
                  <td className="p-3">
                    <select
                      value={v.status}
                      onChange={(e) => updateStatus(v._id, e.target.value)}
                      className="rounded-lg border border-charcoal-200 px-2 py-1 text-xs capitalize"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
