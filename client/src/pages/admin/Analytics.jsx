import { useEffect, useState } from "react";
import { dataService } from "../../services/dataService";

export default function Analytics() {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    dataService.getProperties({ limit: 200 }).then((res) => setProperties(res.data));
  }, []);

  const byArea = properties.reduce((acc, p) => {
    acc[p.location.area] = (acc[p.location.area] || 0) + 1;
    return acc;
  }, {});

  const byType = properties.reduce((acc, p) => {
    acc[p.propertyType] = (acc[p.propertyType] || 0) + 1;
    return acc;
  }, {});

  const maxArea = Math.max(1, ...Object.values(byArea));
  const maxType = Math.max(1, ...Object.values(byType));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900">Analytics</h1>
      <p className="mt-1 text-sm text-charcoal-500">A quick look at listing distribution across the platform.</p>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="mb-4 font-semibold text-charcoal-900">Listings by Area</h3>
          <div className="space-y-3">
            {Object.entries(byArea).map(([area, count]) => (
              <div key={area}>
                <div className="mb-1 flex justify-between text-xs text-charcoal-600">
                  <span>{area}</span><span>{count}</span>
                </div>
                <div className="h-2 rounded-full bg-charcoal-100">
                  <div className="h-2 rounded-full bg-emerald-600" style={{ width: `${(count / maxArea) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="mb-4 font-semibold text-charcoal-900">Listings by Type</h3>
          <div className="space-y-3">
            {Object.entries(byType).map(([type, count]) => (
              <div key={type}>
                <div className="mb-1 flex justify-between text-xs capitalize text-charcoal-600">
                  <span>{type}</span><span>{count}</span>
                </div>
                <div className="h-2 rounded-full bg-charcoal-100">
                  <div className="h-2 rounded-full bg-charcoal-900" style={{ width: `${(count / maxType) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
