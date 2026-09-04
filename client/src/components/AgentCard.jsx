import { Phone, MessageCircle, Mail } from "lucide-react";
import { AgentVerifiedBadge } from "./VerificationBadge";
import { whatsappLink } from "../utils/format";
import { dataService } from "../services/dataService";

export default function AgentCard({ agent, propertyId, onRequestInfo }) {
  if (!agent) return null;

  const logLead = (leadType) =>
    dataService.submitLead({
      name: "Website Visitor",
      phone: "N/A",
      leadType,
      propertyId,
    });

  return (
    <div className="card p-5">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-charcoal-100 text-lg font-bold text-charcoal-600">
          {agent.name?.split(" ").map((n) => n[0]).join("").slice(0, 2)}
        </div>
        <div>
          <p className="font-semibold text-charcoal-900">{agent.name}</p>
          <p className="text-xs text-charcoal-500">{agent.position} · {agent.experience}+ yrs experience</p>
          <div className="mt-1"><AgentVerifiedBadge isVerified={agent.isVerified} /></div>
        </div>
      </div>

      {agent.bio && <p className="mt-4 text-sm leading-relaxed text-charcoal-600">{agent.bio}</p>}

      <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-3">
        <a
          href={whatsappLink(agent.whatsapp, "Hi, I'm interested in a property I saw on Lahore Estate.")}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => logLead("whatsapp_click")}
          className="btn-primary !py-2.5 text-xs"
        >
          <MessageCircle size={14} /> WhatsApp
        </a>
        <a
          href={`tel:${agent.phone}`}
          onClick={() => logLead("call_request")}
          className="btn-secondary !py-2.5 text-xs"
        >
          <Phone size={14} /> Call
        </a>
        <button
          onClick={() => {
            logLead("information_request");
            onRequestInfo?.();
          }}
          className="btn-secondary !py-2.5 text-xs"
        >
          <Mail size={14} /> More Info
        </button>
      </div>
    </div>
  );
}
