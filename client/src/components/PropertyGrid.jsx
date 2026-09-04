import PropertyCard from "./PropertyCard";
import EmptyState from "./EmptyState";

export default function PropertyGrid({ properties, loading, matchScores }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="card overflow-hidden">
            <div className="aspect-[4/3] w-full animate-pulse bg-charcoal-100" />
            <div className="space-y-2 p-4">
              <div className="h-4 w-1/2 animate-pulse rounded bg-charcoal-100" />
              <div className="h-3 w-3/4 animate-pulse rounded bg-charcoal-100" />
              <div className="h-3 w-1/3 animate-pulse rounded bg-charcoal-100" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {properties.map((p) => (
        <PropertyCard key={p._id} property={p} matchScore={matchScores?.[p._id]} />
      ))}
    </div>
  );
}
