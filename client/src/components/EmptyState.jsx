import { SearchX } from "lucide-react";

export default function EmptyState({
  icon: Icon = SearchX,
  title = "We couldn't find an exact match.",
  subtitle = "Try increasing your budget or expanding your preferred area.",
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-charcoal-200 bg-charcoal-50/50 px-6 py-16 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
        <Icon className="text-charcoal-400" size={26} />
      </div>
      <h3 className="font-display text-xl font-semibold text-charcoal-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-charcoal-500">{subtitle}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
