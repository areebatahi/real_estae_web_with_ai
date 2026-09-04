import { useState } from "react";
import { Sparkles, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const EXAMPLES = [
  "I need a 4 bedroom house in DHA Lahore under 2 crore with parking.",
  "Looking for a furnished 2 bed apartment for rent near Model Town.",
  "Show me commercial plots in Garden Town under 5 crore.",
];

export default function AISearchBox({ compact = false, initialQuery = "", onSubmitOverride }) {
  const [query, setQuery] = useState(initialQuery);
  const navigate = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    if (onSubmitOverride) {
      onSubmitOverride(query);
    } else {
      navigate(`/ai-finder?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <form onSubmit={submit} className={compact ? "" : "mx-auto mt-4 max-w-2xl"}>
      <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50/60 p-2 pl-4 shadow-sm">
        <Sparkles className="shrink-0 text-emerald-600" size={18} />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Describe what you're looking for, e.g. '4 bed house in DHA under 2 crore with parking'"
          className="w-full bg-transparent text-sm text-charcoal-800 outline-none placeholder:text-charcoal-400"
        />
        <button type="submit" className="btn-dark !rounded-xl !py-2.5 text-xs shrink-0">
          Find My Property
        </button>
      </div>
      {!compact && (
        <div className="mt-3 flex flex-wrap justify-center gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => setQuery(ex)}
              className="rounded-full border border-charcoal-200 px-3 py-1 text-[11px] text-charcoal-500 hover:border-emerald-400 hover:text-emerald-700"
            >
              {ex}
            </button>
          ))}
        </div>
      )}
    </form>
  );
}

export function AILoadingState() {
  return (
    <div className="flex items-center justify-center gap-2 py-16 text-charcoal-500">
      <Loader2 className="animate-spin" size={18} />
      <span className="text-sm">Analyzing your requirements...</span>
    </div>
  );
}
