import { CalendarCheck2, CircleDot } from "lucide-react";
import { availabilityLabel } from "../utils/format";

const STYLES = {
  available: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  confirmed_today: "bg-amber-50 text-amber-700 ring-amber-200",
  pending_confirmation: "bg-charcoal-100 text-charcoal-600 ring-charcoal-200",
  sold: "bg-red-50 text-red-700 ring-red-200",
  rented: "bg-red-50 text-red-700 ring-red-200",
};

export default function AvailabilityBadge({ status }) {
  const style = STYLES[status] || STYLES.pending_confirmation;
  const Icon = status === "confirmed_today" ? CalendarCheck2 : CircleDot;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1 ring-inset ${style}`}>
      <Icon size={12} />
      {availabilityLabel(status)}
    </span>
  );
}
