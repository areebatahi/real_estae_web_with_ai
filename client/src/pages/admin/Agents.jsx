import { useEffect, useState } from "react";
import { ShieldCheck, Plus, Trash2 } from "lucide-react";
import { api } from "../../services/api";
import { dataService } from "../../services/dataService";

const emptyForm = { name: "", phone: "", whatsapp: "", email: "", position: "Property Consultant", experience: 1, bio: "" };

export default function AdminAgents() {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");

  const load = () => {
    setLoading(true);
    dataService.getAgents().then(setAgents).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const addAgent = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await api.post("/agents", form);
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch (err) {
      setError(err.message || "Could not add agent — connect the backend to manage agents.");
    }
  };

  const toggleVerified = async (a) => {
    try {
      await api.put(`/agents/${a._id}`, { isVerified: !a.isVerified });
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  const remove = async (id) => {
    if (!confirm("Remove this agent?")) return;
    try {
      await api.del(`/agents/${id}`);
      load();
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900">Agents</h1>
          <p className="mt-1 text-sm text-charcoal-500">Manage your in-house property consultants.</p>
        </div>
        <button onClick={() => setShowForm((s) => !s)} className="btn-primary text-xs">
          <Plus size={15} /> Add Agent
        </button>
      </div>

      {showForm && (
        <form onSubmit={addAgent} className="card mb-6 grid grid-cols-1 gap-3 p-5 sm:grid-cols-2">
          <input className="input-field" placeholder="Name" value={form.name} onChange={(e) => update("name", e.target.value)} required />
          <input className="input-field" placeholder="Position" value={form.position} onChange={(e) => update("position", e.target.value)} />
          <input className="input-field" placeholder="Phone" value={form.phone} onChange={(e) => update("phone", e.target.value)} required />
          <input className="input-field" placeholder="WhatsApp number" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} required />
          <input className="input-field" placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
          <input type="number" className="input-field" placeholder="Years of experience" value={form.experience} onChange={(e) => update("experience", e.target.value)} />
          <textarea className="input-field sm:col-span-2" placeholder="Short bio" value={form.bio} onChange={(e) => update("bio", e.target.value)} />
          {error && <p className="text-xs font-medium text-red-600 sm:col-span-2">{error}</p>}
          <button type="submit" className="btn-primary sm:col-span-2">Save Agent</button>
        </form>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <p className="text-charcoal-400">Loading...</p>
        ) : agents.length === 0 ? (
          <p className="text-charcoal-400">No agents found.</p>
        ) : (
          agents.map((a) => (
            <div key={a._id} className="card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-charcoal-900">{a.name}</p>
                  <p className="text-xs text-charcoal-500">{a.position}</p>
                </div>
                <button onClick={() => remove(a._id)} className="text-red-500 hover:text-red-700"><Trash2 size={15} /></button>
              </div>
              <p className="mt-2 text-xs text-charcoal-500">{a.phone}</p>
              <button
                onClick={() => toggleVerified(a)}
                className={`mt-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                  a.isVerified ? "bg-blue-50 text-blue-700" : "bg-charcoal-100 text-charcoal-500"
                }`}
              >
                <ShieldCheck size={12} /> {a.isVerified ? "Verified" : "Mark Verified"}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
