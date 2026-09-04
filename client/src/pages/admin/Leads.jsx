import { useEffect, useState } from "react";
import { api } from "../../services/api";

const STATUSES = ["new", "contacted", "visit_scheduled", "visited", "interested", "closed", "lost"];

export default function AdminLeads() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    api.get(`/leads${filter ? `?status=${filter}` : ""}`)
      .then((res) => setLeads(res.data))
      .catch(() => setError("Connect the backend and log in as admin to view leads."))
      .finally(() => setLoading(false));
  };

  useEffect(load, [filter]);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/leads/${id}`, { status });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900">Leads</h1>
          <p className="mt-1 text-sm text-charcoal-500">Every inquiry, WhatsApp click, and visit request lands here.</p>
        </div>
        <select className="input-field !w-auto" value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
      </div>

      {error && <p className="mb-4 rounded-xl bg-amber-50 p-3 text-xs text-amber-700">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-charcoal-100">
        <table className="w-full min-w-[900px] text-sm">
          <thead className="bg-charcoal-50 text-xs font-semibold uppercase tracking-wide text-charcoal-500">
            <tr>
              <th className="p-3 text-left">Customer</th>
              <th className="p-3 text-left">Phone</th>
              <th className="p-3 text-left">Property</th>
              <th className="p-3 text-left">Lead Type</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-charcoal-400">Loading...</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-charcoal-400">No leads yet.</td></tr>
            ) : (
              leads.map((l) => (
                <tr key={l._id} className="border-t border-charcoal-100">
                  <td className="p-3 font-medium text-charcoal-800">{l.name}</td>
                  <td className="p-3 text-charcoal-600">{l.phone}</td>
                  <td className="p-3 text-charcoal-600">{l.propertyId?.title || "—"}</td>
                  <td className="p-3 capitalize text-charcoal-600">{l.leadType?.replace(/_/g, " ")}</td>
                  <td className="p-3">
                    <select
                      value={l.status}
                      onChange={(e) => updateStatus(l._id, e.target.value)}
                      className="rounded-lg border border-charcoal-200 px-2 py-1 text-xs capitalize"
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                  </td>
                  <td className="p-3 text-xs text-charcoal-500">{new Date(l.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
