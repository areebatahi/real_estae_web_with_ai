import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Pencil, Trash2, ShieldCheck } from "lucide-react";
import { dataService } from "../../services/dataService";
import { api } from "../../services/api";
import { formatPKR } from "../../utils/format";
import VerificationBadge from "../../components/VerificationBadge";
import AvailabilityBadge from "../../components/AvailabilityBadge";

export default function AdminProperties() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    dataService.getProperties({ limit: 100 }).then((res) => setProperties(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const remove = async (id) => {
    if (!confirm("Delete this property? This cannot be undone.")) return;
    try {
      await api.del(`/properties/${id}`);
      load();
    } catch (err) {
      alert(err.message || "Could not delete — connect the backend to manage listings.");
    }
  };

  const toggleVerified = async (p) => {
    try {
      await api.put(`/properties/${p._id}`, { isVerified: !p.isVerified, verificationStatus: !p.isVerified ? "verified" : "pending" });
      load();
    } catch (err) {
      alert(err.message || "Could not update — connect the backend to manage listings.");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-charcoal-900">Properties</h1>
          <p className="mt-1 text-sm text-charcoal-500">Manage all listings on the platform.</p>
        </div>
        <Link to="/admin/properties/new" className="btn-primary text-xs">
          <Plus size={15} /> Add Property
        </Link>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-charcoal-100">
        <table className="w-full min-w-[800px] text-sm">
          <thead className="bg-charcoal-50 text-xs font-semibold uppercase tracking-wide text-charcoal-500">
            <tr>
              <th className="p-3 text-left">Property</th>
              <th className="p-3 text-left">Location</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left">Verification</th>
              <th className="p-3 text-left">Availability</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="p-6 text-center text-charcoal-400">Loading...</td></tr>
            ) : properties.length === 0 ? (
              <tr><td colSpan={6} className="p-6 text-center text-charcoal-400">No properties found.</td></tr>
            ) : (
              properties.map((p) => (
                <tr key={p._id} className="border-t border-charcoal-100">
                  <td className="p-3">
                    <div className="flex items-center gap-3">
                      <img src={p.images?.[0]} className="h-10 w-14 rounded-lg object-cover" alt="" />
                      <span className="line-clamp-1 max-w-[220px] font-medium text-charcoal-800">{p.title}</span>
                    </div>
                  </td>
                  <td className="p-3 text-charcoal-600">{p.location.area}</td>
                  <td className="p-3 font-semibold text-charcoal-800">{formatPKR(p.price)}</td>
                  <td className="p-3"><VerificationBadge isVerified={p.isVerified} /></td>
                  <td className="p-3"><AvailabilityBadge status={p.availabilityStatus} /></td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => toggleVerified(p)} title="Toggle verified" className="rounded-lg p-1.5 text-blue-600 hover:bg-blue-50"><ShieldCheck size={15} /></button>
                      <Link to={`/admin/properties/${p._id}/edit`} className="rounded-lg p-1.5 text-charcoal-600 hover:bg-charcoal-100"><Pencil size={15} /></Link>
                      <button onClick={() => remove(p._id)} className="rounded-lg p-1.5 text-red-600 hover:bg-red-50"><Trash2 size={15} /></button>
                    </div>
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
