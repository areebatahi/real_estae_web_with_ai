import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, MapPin } from "lucide-react";
import { AREAS } from "../data/properties";

export default function HeroSearch() {
  const navigate = useNavigate();
  const [purpose, setPurpose] = useState("buy");
  const [area, setArea] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [bedrooms, setBedrooms] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    params.set("purpose", purpose);
    if (area) params.set("area", area);
    if (propertyType) params.set("propertyType", propertyType);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (bedrooms) params.set("bedrooms", bedrooms);
    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="mx-auto max-w-3xl rounded-3xl bg-white p-2 shadow-premium">
      <div className="flex gap-1 p-2">
        {["buy", "rent"].map((p) => (
          <button
            key={p}
            onClick={() => setPurpose(p)}
            className={`flex-1 rounded-2xl py-2.5 text-sm font-semibold capitalize transition ${
              purpose === p ? "bg-charcoal-900 text-white" : "text-charcoal-500 hover:bg-charcoal-50"
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      <form onSubmit={handleSearch} className="grid grid-cols-1 gap-2 p-2 sm:grid-cols-2 lg:grid-cols-5">
        <div className="relative lg:col-span-2">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-400" size={16} />
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="input-field pl-9"
          >
            <option value="">Any location in Lahore</option>
            {AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>

        <select value={propertyType} onChange={(e) => setPropertyType(e.target.value)} className="input-field">
          <option value="">Property Type</option>
          <option value="house">House</option>
          <option value="apartment">Apartment</option>
          <option value="plot">Plot</option>
          <option value="commercial">Commercial</option>
        </select>

        <select value={bedrooms} onChange={(e) => setBedrooms(e.target.value)} className="input-field">
          <option value="">Bedrooms</option>
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <option key={n} value={n}>{n}+</option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Max Budget (PKR)"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="input-field"
        />

        <button type="submit" className="btn-primary sm:col-span-2 lg:col-span-5">
          <Search size={16} /> Search Properties
        </button>
      </form>
    </div>
  );
}
