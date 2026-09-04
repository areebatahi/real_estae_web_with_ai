import { ShieldCheck, Users, Building2 } from "lucide-react";

const COMPANY_NAME = import.meta.env.VITE_COMPANY_NAME || "Lahore Estate";

export default function About() {
  return (
    <div className="container-px mx-auto max-w-4xl py-16">
      <h1 className="section-heading">About {COMPANY_NAME}</h1>
      <p className="mt-4 leading-relaxed text-charcoal-600">
        {COMPANY_NAME} is a Lahore-based real estate company focused on making property
        discovery honest, fast, and stress-free. Every listing on this platform is added and
        managed directly by our own team — not third-party agents — so what you see is what's
        actually available.
      </p>
      <p className="mt-4 leading-relaxed text-charcoal-600">
        We built this platform because searching for property in Lahore is often frustrating:
        outdated listings, incomplete information, and slow responses. Our goal is simple —
        verified properties, verified agents, and a search experience that respects your time.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        <div className="card p-6 text-center">
          <ShieldCheck className="mx-auto mb-3 text-emerald-600" size={28} />
          <p className="font-semibold text-charcoal-900">Verification First</p>
          <p className="mt-1 text-sm text-charcoal-500">Every property is reviewed before publishing.</p>
        </div>
        <div className="card p-6 text-center">
          <Users className="mx-auto mb-3 text-emerald-600" size={28} />
          <p className="font-semibold text-charcoal-900">In-house Agents</p>
          <p className="mt-1 text-sm text-charcoal-500">A dedicated, verified team — not random contacts.</p>
        </div>
        <div className="card p-6 text-center">
          <Building2 className="mx-auto mb-3 text-emerald-600" size={28} />
          <p className="font-semibold text-charcoal-900">Lahore Focused</p>
          <p className="mt-1 text-sm text-charcoal-500">Deep coverage across DHA, Gulberg, Bahria Town and more.</p>
        </div>
      </div>
    </div>
  );
}
