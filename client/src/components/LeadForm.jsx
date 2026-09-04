import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { dataService } from "../services/dataService";

export default function LeadForm({ leadType = "information_request", propertyId, title = "Request More Information" }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.phone) return;
    setSubmitting(true);
    try {
      await dataService.submitLead({ ...form, leadType, propertyId });
      setDone(true);
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="card flex flex-col items-center gap-2 p-6 text-center">
        <CheckCircle2 className="text-emerald-600" size={32} />
        <p className="font-semibold text-charcoal-900">Thanks, {form.name.split(" ")[0]}!</p>
        <p className="text-sm text-charcoal-500">One of our agents will reach out shortly.</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="card space-y-3 p-5">
      <h4 className="font-display text-base font-semibold text-charcoal-900">{title}</h4>
      <input className="input-field" placeholder="Full name" value={form.name} onChange={(e) => update("name", e.target.value)} />
      <input className="input-field" placeholder="Phone number" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
      <input className="input-field" placeholder="Email (optional)" value={form.email} onChange={(e) => update("email", e.target.value)} />
      <textarea className="input-field" rows={3} placeholder="Your message" value={form.message} onChange={(e) => update("message", e.target.value)} />
      <button type="submit" disabled={submitting} className="btn-primary w-full">
        {submitting ? "Sending..." : "Send Inquiry"}
      </button>
    </form>
  );
}
