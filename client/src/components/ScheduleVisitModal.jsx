import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, CheckCircle2 } from "lucide-react";
import { dataService } from "../services/dataService";

export default function ScheduleVisitModal({ open, onClose, property }) {
  const [form, setForm] = useState({ name: "", phone: "", whatsapp: "", preferredDate: "", preferredTime: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.phone || !form.preferredDate || !form.preferredTime) {
      setError("Please fill in your name, phone, and preferred date/time.");
      return;
    }
    setSubmitting(true);
    try {
      await dataService.submitVisit({ ...form, propertyId: property?._id });
      setDone(true);
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const close = () => {
    onClose();
    setTimeout(() => {
      setDone(false);
      setForm({ name: "", phone: "", whatsapp: "", preferredDate: "", preferredTime: "", message: "" });
    }, 300);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-end justify-center bg-charcoal-950/50 backdrop-blur-sm sm:items-center"
          onClick={close}
        >
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-md rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl"
          >
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold text-charcoal-900">Schedule a Visit</h3>
              <button onClick={close} className="rounded-full p-1.5 hover:bg-charcoal-100">
                <X size={18} />
              </button>
            </div>

            {done ? (
              <div className="flex flex-col items-center py-8 text-center">
                <CheckCircle2 className="mb-3 text-emerald-600" size={40} />
                <p className="font-semibold text-charcoal-900">Visit request received!</p>
                <p className="mt-1 text-sm text-charcoal-500">
                  Our team will confirm your {property?.title ? `visit to ${property.title}` : "visit"} shortly on WhatsApp or a call.
                </p>
                <button onClick={close} className="btn-primary mt-6">Done</button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                {property && (
                  <p className="rounded-lg bg-charcoal-50 px-3 py-2 text-xs text-charcoal-600">
                    Scheduling a visit for <span className="font-semibold">{property.title}</span>
                  </p>
                )}
                <div>
                  <label className="label">Name</label>
                  <input className="input-field" value={form.name} onChange={(e) => update("name", e.target.value)} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Phone</label>
                    <input className="input-field" value={form.phone} onChange={(e) => update("phone", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">WhatsApp</label>
                    <input className="input-field" value={form.whatsapp} onChange={(e) => update("whatsapp", e.target.value)} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Preferred Date</label>
                    <input type="date" className="input-field" value={form.preferredDate} onChange={(e) => update("preferredDate", e.target.value)} />
                  </div>
                  <div>
                    <label className="label">Preferred Time</label>
                    <input type="time" className="input-field" value={form.preferredTime} onChange={(e) => update("preferredTime", e.target.value)} />
                  </div>
                </div>
                <div>
                  <label className="label">Message (optional)</label>
                  <textarea rows={3} className="input-field" value={form.message} onChange={(e) => update("message", e.target.value)} />
                </div>
                {error && <p className="text-xs font-medium text-red-600">{error}</p>}
                <button type="submit" disabled={submitting} className="btn-primary w-full">
                  {submitting ? "Submitting..." : "Schedule Visit"}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
