import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Building2, PlusCircle, Users2, UserCog,
  CalendarClock, ShieldCheck, BarChart3, Settings, LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

const items = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/properties", label: "Properties", icon: Building2 },
  { to: "/admin/properties/new", label: "Add Property", icon: PlusCircle },
  { to: "/admin/leads", label: "Leads", icon: Users2 },
  { to: "/admin/visits", label: "Visit Requests", icon: CalendarClock },
  { to: "/admin/agents", label: "Agents", icon: UserCog },
  { to: "/admin/verification", label: "Verification", icon: ShieldCheck },
  { to: "/admin/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/admin/settings", label: "Settings", icon: Settings },
];

export default function AdminSidebar() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-charcoal-100 bg-white lg:flex">
      <div className="border-b border-charcoal-100 p-6">
        <p className="font-display text-lg font-bold text-charcoal-900">Lahore Estate</p>
        <p className="text-xs text-charcoal-500">Admin Dashboard</p>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {items.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                isActive ? "bg-emerald-50 text-emerald-700" : "text-charcoal-600 hover:bg-charcoal-50"
              }`
            }
          >
            <item.icon size={17} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-charcoal-100 p-4">
        <p className="mb-2 truncate text-xs text-charcoal-500">{user?.email}</p>
        <button
          onClick={() => { logout(); navigate("/admin/login"); }}
          className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut size={16} /> Log Out
        </button>
      </div>
    </aside>
  );
}
