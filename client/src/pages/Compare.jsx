import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles, X } from "lucide-react";
import CompareTable from "../components/CompareTable";
import EmptyState from "../components/EmptyState";
import { useCompare } from "../context/CompareContext";
import { dataService } from "../services/dataService";

export default function Compare() {
  const { compareIds, toggleCompare, clearCompare } = useCompare();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [preference, setPreference] = useState("");
  const [aiSummary, setAiSummary] = useState("");
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (compareIds.length < 2) {
      setProperties([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    dataService.compareProperties(compareIds).then((data) => {
      setProperties(data);
      setLoading(false);
    });
  }, [compareIds]);

  const helpMeDecide = async () => {
    setAiLoading(true);
    setAiSummary("");
    try {
      const res = await dataService.aiCompareAssist(compareIds, preference);
      setAiSummary(res.summary);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="container-px mx-auto max-w-6xl py-14">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="section-heading">Compare Properties</h1>
          <p className="mt-2 text-charcoal-500">Select 2–4 properties from any listing page to compare them here.</p>
        </div>
        {compareIds.length > 0 && (
          <button onClick={clearCompare} className="btn-secondary text-xs">
            <X size={14} /> Clear All
          </button>
        )}
      </div>

      {compareIds.length < 2 || loading ? (
        loading && compareIds.length >= 2 ? (
          <p className="text-center text-charcoal-400">Loading comparison...</p>
        ) : (
          <EmptyState
            title="No properties to compare yet"
            subtitle="Browse properties and tap 'Compare' on at least two listings to see them here."
            action={<Link to="/properties" className="btn-primary">Browse Properties</Link>}
          />
        )
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {properties.map((p) => (
              <span key={p._id} className="inline-flex items-center gap-2 rounded-full bg-charcoal-100 px-3 py-1.5 text-xs font-medium text-charcoal-700">
                {p.title}
                <button onClick={() => toggleCompare(p._id)}><X size={12} /></button>
              </span>
            ))}
          </div>

          <CompareTable properties={properties} />

          <div className="mt-10 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-6">
            <div className="flex items-center gap-2 text-emerald-700">
              <Sparkles size={18} />
              <h3 className="font-display text-lg font-semibold">Help Me Decide</h3>
            </div>
            <p className="mt-2 text-sm text-charcoal-600">
              Optionally tell the AI what matters most to you, then let it recommend the better fit.
            </p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row">
              <input
                className="input-field"
                placeholder="e.g. I care most about budget and parking"
                value={preference}
                onChange={(e) => setPreference(e.target.value)}
              />
              <button onClick={helpMeDecide} disabled={aiLoading} className="btn-dark shrink-0">
                {aiLoading ? "Thinking..." : "Help Me Decide"}
              </button>
            </div>
            {aiSummary && (
              <div className="mt-5 rounded-xl bg-white p-4 text-sm leading-relaxed text-charcoal-700 shadow-sm">
                {aiSummary}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
