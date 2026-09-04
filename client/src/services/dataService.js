// Unified data layer: tries the real backend first, and transparently falls back
// to local demo data if the API is unreachable — so the product is always demonstrable.

import { api, USE_BACKEND } from "./api";
import { properties as demoProperties } from "../data/properties";
import { agents as demoAgentsList } from "../data/agents";
import { extractQueryMock, scoreProperty } from "./aiService";

let backendHealthy = null; // null = unknown, true/false = cached result

const checkBackend = async () => {
  if (!USE_BACKEND) return false;
  if (backendHealthy !== null) return backendHealthy;
  try {
    await api.get("/health");
    backendHealthy = true;
  } catch {
    backendHealthy = false;
  }
  return backendHealthy;
};

const matchesFilters = (p, filters) => {
  if (filters.purpose && p.purpose !== filters.purpose) return false;
  if (filters.propertyType && p.propertyType !== filters.propertyType) return false;
  if (filters.area && !p.location.area.toLowerCase().includes(filters.area.toLowerCase())) return false;
  if (filters.bedrooms && p.bedrooms < Number(filters.bedrooms)) return false;
  if (filters.bathrooms && p.bathrooms < Number(filters.bathrooms)) return false;
  if (filters.furnished && p.furnished !== filters.furnished) return false;
  if (filters.parking === "true" && !p.parking) return false;
  if (filters.verifiedOnly === "true" && !p.isVerified) return false;
  if (filters.availableToday === "true" && p.availabilityStatus !== "confirmed_today") return false;
  if (filters.minPrice && p.price < Number(filters.minPrice)) return false;
  if (filters.maxPrice && p.price > Number(filters.maxPrice)) return false;
  if (filters.q) {
    const q = filters.q.toLowerCase();
    if (!p.title.toLowerCase().includes(q) && !p.description.toLowerCase().includes(q)) return false;
  }
  return true;
};

const sortLocal = (list, sortKey) => {
  const copy = [...list];
  switch (sortKey) {
    case "newest":
      return copy; // demo data has no real dates; keep insertion order
    case "price_low":
      return copy.sort((a, b) => a.price - b.price);
    case "price_high":
      return copy.sort((a, b) => b.price - a.price);
    case "area_large":
      return copy.sort((a, b) => b.area.value - a.area.value);
    default:
      return copy.sort((a, b) => Number(b.isVerified) - Number(a.isVerified));
  }
};

export const dataService = {
  async getProperties(filters = {}) {
    const healthy = await checkBackend();
    if (healthy) {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/properties?${params}`);
      return res;
    }
    const filtered = demoProperties.filter((p) => matchesFilters(p, filters));
    const sorted = sortLocal(filtered, filters.sort);
    const page = Number(filters.page) || 1;
    const limit = Number(filters.limit) || 12;
    const start = (page - 1) * limit;
    return {
      data: sorted.slice(start, start + limit),
      total: sorted.length,
      page,
      pages: Math.ceil(sorted.length / limit) || 1,
    };
  },

  async getPropertyById(idOrSlug) {
    const healthy = await checkBackend();
    if (healthy) {
      const res = await api.get(`/properties/${idOrSlug}`);
      return res.data;
    }
    return demoProperties.find((p) => p._id === idOrSlug || p.slug === idOrSlug) || null;
  },

  async compareProperties(ids) {
    const healthy = await checkBackend();
    if (healthy) {
      const res = await api.get(`/properties/compare?ids=${ids.join(",")}`);
      return res.data;
    }
    return demoProperties.filter((p) => ids.includes(p._id));
  },

  async getAgents() {
    const healthy = await checkBackend();
    if (healthy) {
      const res = await api.get("/agents");
      return res.data;
    }
    return demoAgentsList;
  },

  async submitLead(lead) {
    const healthy = await checkBackend();
    if (healthy) {
      return api.post("/leads", lead);
    }
    console.info("[demo mode] Lead captured locally:", lead);
    return { success: true, data: { ...lead, _id: `local-${Date.now()}` } };
  },

  async submitVisit(visit) {
    const healthy = await checkBackend();
    if (healthy) {
      return api.post("/visits", visit);
    }
    console.info("[demo mode] Visit request captured locally:", visit);
    return { success: true, data: { ...visit, _id: `local-${Date.now()}` } };
  },

  async aiPropertyMatch(query, extras = {}) {
    const healthy = await checkBackend();
    if (healthy) {
      return api.post("/ai/property-match", { query, ...extras });
    }
    const criteria = extractQueryMock(query);
    const filter = criteria.purpose ? { purpose: criteria.purpose } : {};
    const candidates = demoProperties.filter((p) => matchesFilters(p, filter));
    const ranked = candidates
      .map((property) => {
        const { matchScore, reasons, mismatches } = scoreProperty(property, criteria);
        return { property, matchScore, reasons, mismatches };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 12);
    return { success: true, criteria, count: ranked.length, data: ranked };
  },

  async aiCompareAssist(propertyIds, preference) {
    const healthy = await checkBackend();
    if (healthy) {
      return api.post("/ai/compare-assist", { propertyIds, preference });
    }
    const props = demoProperties.filter((p) => propertyIds.includes(p._id));
    const criteria = preference ? extractQueryMock(preference) : {};
    const scored = props
      .map((property) => {
        const { matchScore, reasons, mismatches } = scoreProperty(property, criteria);
        return { property, matchScore, reasons, mismatches };
      })
      .sort((a, b) => b.matchScore - a.matchScore);
    const winner = scored[0];
    const runnerUp = scored[1];
    let summary;
    if (preference) {
      summary = `Based on "${preference}", ${winner.property.title} in ${winner.property.location.area} is the strongest fit at a ${winner.matchScore}% match.`;
    } else {
      summary = `${winner.property.title} in ${winner.property.location.area} offers the best overall balance of price, size, and verification among the selected properties.${
        runnerUp ? ` It compares favorably to ${runnerUp.property.title}.` : ""
      }`;
    }
    return { success: true, summary, ranked: scored };
  },
};
