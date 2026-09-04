import { useEffect, useState } from "react";
import { Building2, ShieldCheck, Users2, CalendarClock, TrendingUp, Home as HomeIcon } from "lucide-react";
import StatCard from "../../components/StatCard";
import { dataService } from "../../services/dataService";
import { api } from "../../services/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const [propsRes, leadsRes, visitsRes] = await Promise.all([
          dataService.getProperties({ limit: 200 }),
          api.get("/leads").catch(() => ({ data: [] })),
          api.get("/visits").catch(() => ({ data: [] })),
        ]);
        const properties = propsRes.data || [];
        const leads = leadsRes.data || [];
        const visits = visitsRes.data || [];

        setStats({
          total: properties.length,
          available: properties.filter((p) => p.availabilityStatus === "available" || p.availabilityStatus === "confirmed_today").length,
          sold: properties.filter((p) => p.availabilityStatus === "sold").length,
          rented: properties.filter((p) => p.availabilityStatus === "rented").length,
          newLeads: leads.filter((l) => l.status === "new").length,
          scheduledVisits: visits.filter((v) => v.status === "pending" || v.status === "confirmed").length,
          conversionRate: leads.length ? Math.round((leads.filter((l) => l.status === "closed").length / leads.length) * 100) : 0,
        });
      } catch {
        setStats({ total: 0, available: 0, sold: 0, rented: 0, newLeads: 0, scheduledVisits: 0, conversionRate: 0 });
      }
    })();
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-charcoal-900">Dashboard Overview</h1>
      <p className="mt-1 text-sm text-charcoal-500">A snapshot of your properties, leads, and visits.</p>

      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total Properties" value={stats?.total ?? "—"} icon={Building2} accent="charcoal" />
        <StatCard label="Available" value={stats?.available ?? "—"} icon={HomeIcon} accent="emerald" />
        <StatCard label="Sold" value={stats?.sold ?? "—"} icon={ShieldCheck} accent="red" />
        <StatCard label="Rented" value={stats?.rented ?? "—"} icon={ShieldCheck} accent="blue" />
        <StatCard label="New Leads" value={stats?.newLeads ?? "—"} icon={Users2} accent="amber" />
        <StatCard label="Scheduled Visits" value={stats?.scheduledVisits ?? "—"} icon={CalendarClock} accent="emerald" />
        <StatCard label="Conversion Rate" value={`${stats?.conversionRate ?? 0}%`} icon={TrendingUp} accent="blue" />
      </div>

      <div className="mt-10 rounded-2xl border border-dashed border-charcoal-200 p-6 text-sm text-charcoal-500">
        Connect the backend (see server/README setup) to see live data pulled from MongoDB.
        Without a backend connection, this dashboard reflects the local demo dataset only where possible.
      </div>
    </div>
  );
}
