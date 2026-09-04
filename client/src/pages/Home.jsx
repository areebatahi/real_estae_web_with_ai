import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ShieldCheck, Sparkles, Scale, MapPinned, MessageCircle,
  CalendarCheck2, ArrowRight, Star,
} from "lucide-react";
import HeroSearch from "../components/HeroSearch";
import AISearchBox from "../components/AISearchBox";
import PropertyGrid from "../components/PropertyGrid";
import { dataService } from "../services/dataService";

const USPS = [
  { icon: ShieldCheck, title: "Verified Properties", desc: "Every listing is checked by our team before it goes live." },
  { icon: Star, title: "Verified Agents", desc: "Work only with agents who have passed our verification process." },
  { icon: CalendarCheck2, title: "Availability Confirmed Today", desc: "Know exactly which properties are ready to view right now." },
  { icon: Sparkles, title: "AI Recommendations", desc: "Describe what you want in plain language and get ranked matches." },
  { icon: Scale, title: "Property Comparison", desc: "Compare up to 4 properties side-by-side in one view." },
  { icon: MapPinned, title: "Location Intelligence", desc: "See nearby schools, hospitals, and markets before you visit." },
];

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dataService
      .getProperties({ verifiedOnly: "true", limit: 6, sort: "best" })
      .then((res) => setFeatured(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-charcoal-950 pb-20 pt-16 sm:pt-24">
        <div className="absolute inset-0 opacity-40">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600"
            alt=""
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/80 to-charcoal-950/40" />
        </div>

        <div className="container-px relative mx-auto max-w-5xl text-center">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300"
          >
            Verified Properties. Smarter Search. Better Decisions.
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="font-display text-4xl font-bold leading-tight text-white sm:text-5xl lg:text-6xl"
          >
            Find a Property That<br className="hidden sm:block" /> Actually Fits Your Needs.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto mt-5 max-w-2xl text-base text-charcoal-300"
          >
            Discover verified properties across Lahore, compare your options, and get
            AI-powered recommendations based on your budget and lifestyle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-10"
          >
            <HeroSearch />
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
            <Link to="/ai-finder" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200">
              <Sparkles size={16} /> Find My Property with AI <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* USPs */}
      <section className="container-px mx-auto max-w-7xl py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="section-heading">Why Search With Us</h2>
          <p className="mt-3 text-charcoal-500">
            We built this platform to solve the real frustrations of property hunting in Lahore.
          </p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {USPS.map((u, i) => (
            <motion.div
              key={u.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="card p-6"
            >
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <u.icon size={20} />
              </div>
              <h3 className="font-semibold text-charcoal-900">{u.title}</h3>
              <p className="mt-1.5 text-sm text-charcoal-500">{u.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* AI Finder CTA */}
      <section className="bg-charcoal-50 py-16 sm:py-20">
        <div className="container-px mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
            <Sparkles size={13} /> AI Property Finder
          </span>
          <h2 className="section-heading mt-4">Just describe what you need.</h2>
          <p className="mt-3 text-charcoal-500">
            "I need a 4 bedroom house in DHA Lahore under 2 crore with parking." Our AI reads
            your request, ranks matching properties, and explains why each one fits.
          </p>
          <div className="mt-8">
            <AISearchBox />
          </div>
        </div>
      </section>

      {/* Featured properties */}
      <section className="container-px mx-auto max-w-7xl py-16 sm:py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-heading">Featured Verified Properties</h2>
            <p className="mt-2 text-charcoal-500">Hand-picked, verified listings across Lahore.</p>
          </div>
          <Link to="/properties" className="btn-secondary">
            View All Properties <ArrowRight size={15} />
          </Link>
        </div>
        <PropertyGrid properties={featured} loading={loading} />
      </section>

      {/* Trust strip */}
      <section className="bg-charcoal-900 py-16">
        <div className="container-px mx-auto grid max-w-5xl grid-cols-1 gap-8 text-center sm:grid-cols-3">
          <div>
            <p className="font-display text-3xl font-bold text-white">100%</p>
            <p className="mt-1 text-sm text-charcoal-400">Verified Listings Reviewed by Our Team</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-white">9</p>
            <p className="mt-1 text-sm text-charcoal-400">Prime Lahore Locations Covered</p>
          </div>
          <div>
            <p className="font-display text-3xl font-bold text-white">&lt; 1 hr</p>
            <p className="mt-1 text-sm text-charcoal-400">Average Agent Response Time</p>
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="container-px mx-auto max-w-7xl py-16 text-center sm:py-20">
        <h2 className="section-heading">Have a specific property in mind?</h2>
        <p className="mx-auto mt-3 max-w-lg text-charcoal-500">
          Message our team directly on WhatsApp and one of our verified agents will help you
          shortlist options today.
        </p>
        <a
          href="https://wa.me/923001234567"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary mt-6"
        >
          <MessageCircle size={16} /> Chat on WhatsApp
        </a>
      </section>
    </div>
  );
}
