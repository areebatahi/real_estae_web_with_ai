import { Check, X } from "lucide-react";
import { formatPKR, formatArea } from "../utils/format";
import VerificationBadge from "./VerificationBadge";
import AvailabilityBadge from "./AvailabilityBadge";
import { AMENITIES } from "../data/properties";

const ROWS = [
  { key: "price", label: "Price", render: (p) => formatPKR(p.price) },
  { key: "location", label: "Location", render: (p) => `${p.location.area}, Lahore` },
  { key: "propertyType", label: "Property Type", render: (p) => <span className="capitalize">{p.propertyType}</span> },
  { key: "area", label: "Area", render: (p) => formatArea(p.area) },
  { key: "bedrooms", label: "Bedrooms", render: (p) => p.bedrooms || "—" },
  { key: "bathrooms", label: "Bathrooms", render: (p) => p.bathrooms || "—" },
  { key: "parking", label: "Parking", render: (p) => (p.parking ? <Check className="text-emerald-600" size={16} /> : <X className="text-charcoal-300" size={16} />) },
  { key: "furnished", label: "Furnishing", render: (p) => <span className="capitalize">{p.furnished}</span> },
  { key: "verification", label: "Verification", render: (p) => <VerificationBadge isVerified={p.isVerified} /> },
  { key: "availability", label: "Availability", render: (p) => <AvailabilityBadge status={p.availabilityStatus} /> },
];

export default function CompareTable({ properties }) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-charcoal-100">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="w-40 border-b border-charcoal-100 bg-charcoal-50 p-3 text-left text-xs font-semibold uppercase tracking-wide text-charcoal-500">
              Attribute
            </th>
            {properties.map((p) => (
              <th key={p._id} className="border-b border-charcoal-100 bg-charcoal-50 p-3 text-left">
                <img src={p.images?.[0]} alt="" className="mb-2 h-20 w-full rounded-lg object-cover" />
                <p className="line-clamp-2 text-xs font-semibold text-charcoal-900">{p.title}</p>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((row) => (
            <tr key={row.key} className="border-b border-charcoal-50 last:border-0">
              <td className="p-3 text-xs font-semibold text-charcoal-500">{row.label}</td>
              {properties.map((p) => (
                <td key={p._id} className="p-3 text-charcoal-800">{row.render(p)}</td>
              ))}
            </tr>
          ))}
          <tr>
            <td className="p-3 text-xs font-semibold text-charcoal-500">Amenities</td>
            {properties.map((p) => (
              <td key={p._id} className="p-3">
                <div className="flex flex-wrap gap-1">
                  {AMENITIES.filter((a) => p.amenities?.includes(a)).map((a) => (
                    <span key={a} className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                      {a}
                    </span>
                  ))}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
