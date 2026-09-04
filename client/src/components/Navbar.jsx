import { useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, Heart, Sparkles } from "lucide-react";
import WhatsAppButton from "./WhatsAppButton";
import { useSavedProperties } from "../context/SavedPropertiesContext";

const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME || "Lahore Estate";

const links = [
  { to: "/", label: "Home" },
  { to: "/properties", label: "Properties" },
  { to: "/ai-finder", label: "AI Property Finder" },
  { to: "/compare", label: "Compare" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { savedIds } = useSavedProperties();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 transition-all ${
        scrolled ? "bg-white/90 shadow-premium backdrop-blur-md" : "bg-white"
      }`}
    >
      <nav className="container-px mx-auto flex h-16 max-w-7xl items-center justify-between lg:h-20">
        <Link to="/" className="flex items-center gap-2">
          <span className="font-display text-xl font-bold text-charcoal-900 lg:text-2xl">
            {COMPANY_NAME}
          </span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition hover:text-emerald-600 ${
                  isActive ? "text-emerald-600" : "text-charcoal-600"
                } ${l.to === "/ai-finder" ? "inline-flex items-center gap-1" : ""}`
              }
            >
              {l.to === "/ai-finder" && <Sparkles size={14} />}
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <button
            onClick={() => navigate("/saved")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full border border-charcoal-200 text-charcoal-700 transition hover:border-charcoal-400"
            aria-label="Saved properties"
          >
            <Heart size={18} />
            {savedIds.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                {savedIds.length}
              </span>
            )}
          </button>
          <WhatsAppButton className="btn-primary" />
        </div>

        <button
          className="flex h-10 w-10 items-center justify-center rounded-lg text-charcoal-800 lg:hidden"
          onClick={() => setOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-charcoal-100 bg-white px-5 pb-6 pt-2 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  `rounded-lg px-3 py-3 text-sm font-medium ${
                    isActive ? "bg-emerald-50 text-emerald-700" : "text-charcoal-700"
                  }`
                }
              >
                {l.label}
              </NavLink>
            ))}
            <NavLink
              to="/saved"
              onClick={() => setOpen(false)}
              className="rounded-lg px-3 py-3 text-sm font-medium text-charcoal-700"
            >
              Saved Properties ({savedIds.length})
            </NavLink>
          </div>
          <div className="mt-4">
            <WhatsAppButton className="btn-primary w-full" />
          </div>
        </div>
      )}
    </header>
  );
}
