import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Sparkles, CheckCircle2, XCircle } from "lucide-react";
import AISearchBox, { AILoadingState } from "../components/AISearchBox";
import PropertyCard from "../components/PropertyCard";
import EmptyState from "../components/EmptyState";
import { formatPKR } from "../utils/format";
import { dataService } from "../services/dataService";

export default function AIFinder() {
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [criteria, setCriteria] = useState(null);

  const runSearch = async (query) => {
    setLoading(true);
    setResults(null);
    try {
      const res = await dataService.aiPropertyMatch(query, { saveLead: false });
      setResults(res.data);
      setCriteria(res.criteria);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialQuery) runSearch(initialQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="container-px mx-auto max-w-5xl py-14">
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
          <Sparkles size={13} /> AI Property Finder
        </span>
        <h1 className="section-heading mt-4">Tell us what you're looking for.</h1>
        <p className="mx-auto mt-3 max-w-xl text-charcoal-500">
          Describe your ideal property in your own words — budget, location, bedrooms, whatever
          matters to you. We'll rank the best matches from verified listings.
        </p>
      </div>

      <div className="mt-8">
        <AISearchBoxWithHandler initialQuery={initialQuery} onSearch={runSearch} />
      </div>

      {loading && <AILoadingState />}

      {!loading && results && criteria && (
        <div className="mt-10">
          <div className="mb-8 flex flex-wrap gap-2 rounded-2xl bg-charcoal-50 p-4 text-xs text-charcoal-600">
            <CriteriaChip label="Purpose" value={criteria.purpose} />
            {criteria.location && <CriteriaChip label="Location" value={criteria.location} />}
            {criteria.propertyType && <CriteriaChip label="Type" value={criteria.propertyType} />}
            {criteria.bedrooms && <CriteriaChip label="Bedrooms" value={criteria.bedrooms} />}
            {criteria.budget && <CriteriaChip label="Budget" value={formatPKR(criteria.budget)} />}
            {criteria.parkingRequired && <CriteriaChip label="Parking" value="Required" />}
          </div>

          {results.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
              {results.map(({ property, matchScore, reasons, mismatches }) => (
                <div key={property._id}>
                  <PropertyCard property={property} matchScore={matchScore} />
                  <div className="mt-3 rounded-xl border border-charcoal-100 p-4 text-xs">
                    <p className="mb-2 font-semibold text-charcoal-700">Why this matches you</p>
                    <ul className="space-y-1">
                      {reasons.map((r, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-emerald-700">
                          <CheckCircle2 size={13} /> {r}
                        </li>
                      ))}
                      {mismatches.map((m, i) => (
                        <li key={i} className="flex items-center gap-1.5 text-amber-700">
                          <XCircle size={13} /> {m}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AISearchBoxWithHandler({ initialQuery, onSearch }) {
  return (
    <AISearchBox
      compact={false}
      key={initialQuery}
      initialQuery={initialQuery}
      onSubmitOverride={onSearch}
    />
  );
}

function CriteriaChip({ label, value }) {
  return (
    <span className="rounded-full bg-white px-3 py-1.5 font-medium capitalize shadow-sm">
      <span className="text-charcoal-400">{label}:</span> {value}
    </span>
  );
}
