import { AREAS, AMENITIES } from "../data/properties";
import { X } from "lucide-react";

const PROPERTY_TYPES = ["house", "apartment", "plot", "commercial"];

export default function PropertyFilters({ filters, setFilters, onClose }) {
  const update = (key, value) => setFilters((prev) => ({ ...prev, [key]: value }));

  const reset = () =>
    setFilters({ purpose: filters.purpose }); // keep buy/rent tab, clear the rest

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between lg:hidden">
        <h3 className="font-display text-lg font-semibold">Filters</h3>
        <button onClick={onClose} className="rounded-full p-1.5 hover:bg-charcoal-100">
          <X size={18} />
        </button>
      </div>

      <div>
        <label className="label">Location</label>
        <select
          className="input-field"
          value={filters.area || ""}
          onChange={(e) => update("area", e.target.value)}
        >
          <option value="">All areas of Lahore</option>
          {AREAS.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label">Property Type</label>
        <div className="grid grid-cols-2 gap-2">
          {PROPERTY_TYPES.map((t) => (
            <button
              key={t}
              onClick={() => update("propertyType", filters.propertyType === t ? "" : t)}
              className={`rounded-xl border px-3 py-2 text-xs font-semibold capitalize transition ${
                filters.propertyType === t
                  ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                  : "border-charcoal-200 text-charcoal-600 hover:border-charcoal-400"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label">Price Range (PKR)</label>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            className="input-field"
            value={filters.minPrice || ""}
            onChange={(e) => update("minPrice", e.target.value)}
          />
          <input
            type="number"
            placeholder="Max"
            className="input-field"
            value={filters.maxPrice || ""}
            onChange={(e) => update("maxPrice", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="label">Bedrooms</label>
          <select
            className="input-field"
            value={filters.bedrooms || ""}
            onChange={(e) => update("bedrooms", e.target.value)}
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <option key={n} value={n}>{n}+</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">Bathrooms</label>
          <select
            className="input-field"
            value={filters.bathrooms || ""}
            onChange={(e) => update("bathrooms", e.target.value)}
          >
            <option value="">Any</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>{n}+</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="label">Furnishing</label>
        <select
          className="input-field"
          value={filters.furnished || ""}
          onChange={(e) => update("furnished", e.target.value)}
        >
          <option value="">Any</option>
          <option value="furnished">Furnished</option>
          <option value="semi-furnished">Semi-furnished</option>
          <option value="unfurnished">Unfurnished</option>
        </select>
      </div>

      <div>
        <label className="label">Amenities</label>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => {
            const active = (filters.amenitiesList || []).includes(a);
            return (
              <button
                key={a}
                onClick={() => {
                  const list = filters.amenitiesList || [];
                  const next = active ? list.filter((x) => x !== a) : [...list, a];
                  update("amenitiesList", next);
                  update("amenities", next.join(","));
                }}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                    : "border-charcoal-200 text-charcoal-600 hover:border-charcoal-400"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-sm font-medium text-charcoal-700">Parking</span>
          <input
            type="checkbox"
            checked={filters.parking === "true"}
            onChange={(e) => update("parking", e.target.checked ? "true" : "")}
            className="h-4 w-4 accent-emerald-600"
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-sm font-medium text-charcoal-700">Verified Only</span>
          <input
            type="checkbox"
            checked={filters.verifiedOnly === "true"}
            onChange={(e) => update("verifiedOnly", e.target.checked ? "true" : "")}
            className="h-4 w-4 accent-emerald-600"
          />
        </label>
        <label className="flex cursor-pointer items-center justify-between">
          <span className="text-sm font-medium text-charcoal-700">Available Today</span>
          <input
            type="checkbox"
            checked={filters.availableToday === "true"}
            onChange={(e) => update("availableToday", e.target.checked ? "true" : "")}
            className="h-4 w-4 accent-emerald-600"
          />
        </label>
      </div>

      <button onClick={reset} className="btn-secondary w-full text-xs">
        Clear All Filters
      </button>
    </div>
  );
}
