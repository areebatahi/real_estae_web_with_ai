import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PropertyGrid from "../components/PropertyGrid";
import EmptyState from "../components/EmptyState";
import { useSavedProperties } from "../context/SavedPropertiesContext";
import { dataService } from "../services/dataService";

export default function Saved() {
  const { savedIds } = useSavedProperties();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (savedIds.length === 0) {
      setProperties([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    Promise.all(savedIds.map((id) => dataService.getPropertyById(id)))
      .then((results) => setProperties(results.filter(Boolean)))
      .finally(() => setLoading(false));
  }, [savedIds]);

  return (
    <div className="container-px mx-auto max-w-7xl py-14">
      <h1 className="section-heading">Saved Properties</h1>
      <p className="mt-2 text-charcoal-500">Properties you've favorited, kept on this device.</p>

      <div className="mt-10">
        {savedIds.length === 0 ? (
          <EmptyState
            title="No saved properties yet"
            subtitle="Tap the heart icon on any listing to save it here for later."
            action={<Link to="/properties" className="btn-primary">Browse Properties</Link>}
          />
        ) : (
          <PropertyGrid properties={properties} loading={loading} />
        )}
      </div>
    </div>
  );
}
