export const formatPKR = (amount, { compact = true } = {}) => {
  if (amount === null || amount === undefined) return "—";
  if (compact) {
    if (amount >= 10000000) return `PKR ${(amount / 10000000).toFixed(amount % 10000000 === 0 ? 0 : 2)} Crore`;
    if (amount >= 100000) return `PKR ${(amount / 100000).toFixed(amount % 100000 === 0 ? 0 : 1)} Lakh`;
    return `PKR ${amount.toLocaleString("en-PK")}`;
  }
  return `PKR ${amount.toLocaleString("en-PK")}`;
};

export const formatArea = (area) => `${area.value} ${area.unit}`;

export const availabilityLabel = (status) => {
  const map = {
    available: "Available",
    confirmed_today: "Availability Confirmed Today",
    pending_confirmation: "Pending Confirmation",
    sold: "Sold",
    rented: "Rented",
  };
  return map[status] || status;
};

export const whatsappLink = (number, message = "") => {
  const clean = (number || "").replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);
  return `https://wa.me/${clean}${text ? `?text=${text}` : ""}`;
};
