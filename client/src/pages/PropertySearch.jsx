import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X } from "lucide-react";
import PropertyGrid from "../components/PropertyGrid";
import PropertyFilters from "../components/PropertyFilters";
import { dataService } from "../services/dataService";

export default function PropertySearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState(() => Object.fromEntries(searchParams.entries()));
  const [result, setResult] = useState({ data: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState(filters.sort || "best");
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const query = { ...filters, sort, page, limit: 12 };
    dataService
      .getProperties(query)
      .then(setResult)
      .finally(() => setLoading(false));
    setSearchParams({ ...filters, purpose: filters.purpose || "buy" }, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sort, page]);

  const purposeTab = filters.purpose || "buy";
  const setPurpose = (p) => setFilters((f) => ({ ...f, purpose: p }));

  const heading = useMemo(() => {
    if (loading) return "Searching properties...";
    return `${result.total} ${result.total === 1 ? "Property" : "Properties"} Found in Lahore`;
  }, [result.total, loading]);

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <div className="mb-6 flex items-center gap-1 rounded-full bg-charcoal-100 p-1 w-fit">
        {["buy", "rent"].map((p) => (
          <button
            key={p}
            onClick={() => setPurpose(p)}
            className={`rounded-full px-5 py-2 text-sm font-semibold capitalize transition ${
              purposeTab === p ? "bg-white text-charcoal-900 shadow-sm" : "text-charcoal-500"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-24 card p-5">
            <PropertyFilters filters={filters} setFilters={setFilters} />
          </div>
        </aside>

        <div>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
            <h1 className="font-display text-xl font-semibold text-charcoal-900">{heading}</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(true)}
                className="btn-secondary !py-2 text-xs lg:hidden"
              >
                <SlidersHorizontal size={14} /> Filters
              </button>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="input-field !w-auto !py-2 text-xs"
              >
                <option value="best">Best Match</option>
                <option value="newest">Newest</option>
                <option value="price_low">Lowest Price</option>
                <option value="price_high">Highest Price</option>
                <option value="area_large">Largest Area</option>
              </select>
            </div>
          </div>

          <PropertyGrid properties={result.data} loading={loading} />

          {result.pages > 1 && (
            <div className="mt-10 flex justify-center gap-2">
              {Array.from({ length: result.pages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`h-9 w-9 rounded-full text-sm font-semibold transition ${
                    page === i + 1 ? "bg-charcoal-900 text-white" : "bg-charcoal-100 text-charcoal-600"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {showFilters && (
        <div className="fixed inset-0 z-[100] flex lg:hidden">
          <div className="absolute inset-0 bg-charcoal-950/50" onClick={() => setShowFilters(false)} />
          <div className="relative ml-auto flex h-full w-[85%] max-w-sm flex-col overflow-y-auto bg-white p-5">
            <PropertyFilters filters={filters} setFilters={setFilters} onClose={() => setShowFilters(false)} />
            <button onClick={() => setShowFilters(false)} className="btn-primary mt-6">
              Show {result.total} Results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
