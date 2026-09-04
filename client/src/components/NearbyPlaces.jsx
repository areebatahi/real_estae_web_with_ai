import { School, Hospital, ShoppingBag, Utensils, Bus, MapPin } from "lucide-react";

const ICONS = {
  school: School,
  hospital: Hospital,
  market: ShoppingBag,
  restaurant: Utensils,
  transport: Bus,
  other: MapPin,
};

export default function NearbyPlaces({ places = [] }) {
  if (!places.length) return null;
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
      {places.map((p, i) => {
        const Icon = ICONS[p.category] || MapPin;
        return (
          <div key={i} className="flex items-center gap-3 rounded-xl border border-charcoal-100 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Icon size={16} />
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-charcoal-800">{p.name}</p>
              <p className="text-[11px] text-charcoal-500">{p.distanceKm} km away</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
