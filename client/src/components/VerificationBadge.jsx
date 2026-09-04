import { ShieldCheck, Clock, XCircle } from "lucide-react";

export default function VerificationBadge({ isVerified, size = "sm" }) {
  const px = size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs";
  if (isVerified) {
    return (
      <span className={`inline-flex items-center gap-1 rounded-full bg-emerald-50 ${px} font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200`}>
        <ShieldCheck size={size === "sm" ? 12 : 14} />
        Verified Property
      </span>
    );
  }
  return (
    <span className={`inline-flex items-center gap-1 rounded-full bg-amber-50 ${px} font-semibold text-amber-700 ring-1 ring-inset ring-amber-200`}>
      <Clock size={size === "sm" ? 12 : 14} />
      Pending Verification
    </span>
  );
}

export function AgentVerifiedBadge({ isVerified }) {
  if (!isVerified) return null;
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700 ring-1 ring-inset ring-blue-200">
      <ShieldCheck size={12} />
      Verified Agent
    </span>
  );
}

export function RejectedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-1 text-[11px] font-semibold text-red-700 ring-1 ring-inset ring-red-200">
      <XCircle size={12} />
      Rejected
    </span>
  );
}
