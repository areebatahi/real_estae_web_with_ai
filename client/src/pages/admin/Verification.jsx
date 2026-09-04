import { useEffect, useState } from "react";
import { ShieldCheck, ShieldX } from "lucide-react";
import { dataService } from "../../services/dataService";
import { api } from "../../services/api";
import { formatPKR } from "../../utils/format";

export default function Verification() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    dataService.getProperties({ limit: 100 }).then((res) => setProperties(res.data)).finally(() => setLoading(false));
  };

  useEffect(load, []);

  const pending = properties.filter((p) => !p.isVerified);

  const setVerification = async (id, verified) => {
    try {
      await api.put(`/properties/${id}`, {
        isVerified: verified,
        verificationStatus: verified ? "verified" : "rejected",
      });
      load();
    } catch (err) {
      alert(err.message || "Connect the backend to manage verification.");
    }
  };

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900">Verification</h1>
      <p className="mt-1 text-sm text-charcoal-500">Review and verify properties pending approval.</p>

      <div className="mt-6 space-y-3">
        {loading ? (
          <p className="text-charcoal-400">Loading...</p>
        ) : pending.length === 0 ? (
          <p className="rounded-2xl border border-dashed border-charcoal-200 p-8 text-center text-charcoal-400">
            Nothing pending — all listings are verified.
          </p>
        ) : (
          pending.map((p) => (
            <div key={p._id} className="card flex flex-wrap items-center justify-between gap-4 p-4">
              <div className="flex items-center gap-3">
                <img src={p.images?.[0]} className="h-12 w-16 rounded-lg object-cover" alt="" />
                <div>
                  <p className="text-sm font-semibold text-charcoal-900">{p.title}</p>
                  <p className="text-xs text-charcoal-500">{p.location.area} · {formatPKR(p.price)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setVerification(p._id, true)} className="btn-primary !py-2 text-xs">
                  <ShieldCheck size={14} /> Approve
                </button>
                <button onClick={() => setVerification(p._id, false)} className="btn-secondary !py-2 text-xs">
                  <ShieldX size={14} /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
