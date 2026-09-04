export default function StatCard({ label, value, icon: Icon, accent = "emerald" }) {
  const accentClasses = {
    emerald: "bg-emerald-50 text-emerald-700",
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    charcoal: "bg-charcoal-100 text-charcoal-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${accentClasses[accent]}`}>
        {Icon && <Icon size={20} />}
      </div>
      <div>
        <p className="text-2xl font-bold text-charcoal-900">{value}</p>
        <p className="text-xs font-medium uppercase tracking-wide text-charcoal-500">{label}</p>
      </div>
    </div>
  );
}
