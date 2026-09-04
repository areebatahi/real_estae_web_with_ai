import { MessageCircle } from "lucide-react";
import { whatsappLink } from "../utils/format";
import { dataService } from "../services/dataService";

const COMPANY_WHATSAPP = import.meta.env.VITE_COMPANY_WHATSAPP_NUMBER || "923001234567";

export default function WhatsAppButton({
  number = COMPANY_WHATSAPP,
  message = "Hi, I'm interested in a property listed on Lahore Estate.",
  propertyId,
  className = "btn-primary",
  children,
}) {
  const handleClick = () => {
    dataService.submitLead({
      name: "WhatsApp Visitor",
      phone: "N/A",
      leadType: "whatsapp_click",
      propertyId,
      message,
    });
  };

  return (
    <a
      href={whatsappLink(number, message)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className={className}
    >
      <MessageCircle size={16} />
      {children || "WhatsApp Us"}
    </a>
  );
}
