import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME || "Lahore Estate";
const PHONE = import.meta.env.VITE_COMPANY_PHONE_NUMBER || "+923001234567";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-charcoal-100 bg-charcoal-950 text-charcoal-300">
      <div className="container-px mx-auto max-w-7xl py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="font-display text-xl font-bold text-white">{COMPANY_NAME}</p>
            <p className="mt-3 text-sm leading-relaxed text-charcoal-400">
              Verified Properties. Smarter Search. Better Decisions. Lahore's modern PropTech
              platform for buying, renting, and investing with confidence.
            </p>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Explore</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/properties" className="hover:text-emerald-400">Properties</Link></li>
              <li><Link to="/ai-finder" className="hover:text-emerald-400">AI Property Finder</Link></li>
              <li><Link to="/compare" className="hover:text-emerald-400">Compare Properties</Link></li>
              <li><Link to="/saved" className="hover:text-emerald-400">Saved Properties</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Company</p>
            <ul className="mt-4 space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-emerald-400">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-emerald-400">Contact</Link></li>
              <li><Link to="/admin/login" className="hover:text-emerald-400">Admin Login</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold text-white">Get in Touch</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li className="flex items-center gap-2"><Phone size={14} /> {PHONE}</li>
              <li className="flex items-center gap-2"><Mail size={14} /> hello@lahoreestate.pk</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Lahore, Pakistan</li>
            </ul>
          </div>
        </div>

        <div className="mt-12 border-t border-charcoal-800 pt-6 text-xs text-charcoal-500">
          © {new Date().getFullYear()} {COMPANY_NAME}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
