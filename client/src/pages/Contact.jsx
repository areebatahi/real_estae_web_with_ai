import { Phone, Mail, MapPin } from "lucide-react";
import LeadForm from "../components/LeadForm";
import WhatsAppButton from "../components/WhatsAppButton";

const PHONE = import.meta.env.VITE_COMPANY_PHONE_NUMBER || "+92 XXX XXXXXXX";

export default function Contact() {
  return (
    <div className="container-px mx-auto max-w-5xl py-16">
      <h1 className="section-heading">Get in Touch</h1>
      <p className="mt-3 max-w-lg text-charcoal-500">
        Have a question about a property, or want a consultant to help with your search?
        Reach out — we typically respond within the hour.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <div className="space-y-4">
          <div className="card flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Phone size={18} /></div>
            <div>
              <p className="text-sm font-semibold text-charcoal-900">Call Us</p>
              <p className="text-sm text-charcoal-500">{PHONE}</p>
            </div>
          </div>
          <div className="card flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><Mail size={18} /></div>
            <div>
              <p className="text-sm font-semibold text-charcoal-900">Email Us</p>
              <p className="text-sm text-charcoal-500">hello@lahoreestate.pk</p>
            </div>
          </div>
          <div className="card flex items-center gap-4 p-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><MapPin size={18} /></div>
            <div>
              <p className="text-sm font-semibold text-charcoal-900">Visit Us</p>
              <p className="text-sm text-charcoal-500">Gulberg III, Lahore, Pakistan</p>
            </div>
          </div>
          <WhatsAppButton className="btn-primary w-full" />
        </div>

        <LeadForm leadType="information_request" title="Send Us a Message" />
      </div>
    </div>
  );
}
