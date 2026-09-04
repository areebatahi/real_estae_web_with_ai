import { MapPin } from "lucide-react";

// Lightweight, dependency-free map placeholder styled to match the design system.
// Swap the inner div for a Google Maps / Mapbox embed in production using the
// property's coordinates — see .env for where to add a maps API key.
export default function LocationMap({ area, address }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-charcoal-100">
      <div className="relative flex h-64 items-center justify-center bg-gradient-to-br from-charcoal-100 to-charcoal-200">
        <div className="flex flex-col items-center gap-2 text-charcoal-500">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg">
            <MapPin size={22} />
          </div>
          <p className="text-sm font-semibold text-charcoal-700">{address}</p>
          <p className="text-xs text-charcoal-500">{area}, Lahore</p>
        </div>
      </div>
      <div className="bg-charcoal-50 px-4 py-2 text-center text-[11px] text-charcoal-400">
        Interactive map — connect a Maps API key in .env for live embeds
      </div>
    </div>
  );
}
