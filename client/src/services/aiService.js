// Client-side mock AI extraction + scoring, mirrors server/services/aiMatchService.js
// Used automatically whenever the backend AI endpoint is unavailable (pure demo mode).

const AREA_KEYWORDS = [
  "DHA Lahore",
  "Gulberg",
  "Bahria Town Lahore",
  "Johar Town",
  "Model Town",
  "Cantt",
  "Wapda Town",
  "Askari",
  "Garden Town",
];

const TYPE_KEYWORDS = {
  house: ["house", "home", "villa"],
  apartment: ["apartment", "flat"],
  plot: ["plot", "land", "file"],
  commercial: ["commercial", "shop", "office", "plaza"],
};

const numberFromCroreLakh = (text) => {
  const croreMatch = text.match(/([\d.]+)\s*crore/i);
  if (croreMatch) return Math.round(parseFloat(croreMatch[1]) * 10000000);
  const lakhMatch = text.match(/([\d.]+)\s*lakh/i);
  if (lakhMatch) return Math.round(parseFloat(lakhMatch[1]) * 100000);
  const plainMatch = text.match(/(?:under|below|within|budget of)?\s*(pkr)?\s*([\d,]{5,})/i);
  if (plainMatch) return parseInt(plainMatch[2].replace(/,/g, ""), 10);
  return null;
};

export const extractQueryMock = (text) => {
  const lower = text.toLowerCase();
  const purpose = /\brent\b|\brenting\b|\bfor rent\b/.test(lower) ? "rent" : "buy";

  let location = null;
  for (const area of AREA_KEYWORDS) {
    if (lower.includes(area.toLowerCase())) {
      location = area;
      break;
    }
  }

  let propertyType = null;
  for (const [type, words] of Object.entries(TYPE_KEYWORDS)) {
    if (words.some((w) => lower.includes(w))) {
      propertyType = type;
      break;
    }
  }

  const bedroomMatch = lower.match(/(\d+)\s*(?:bed|bedroom|bhk)/);
  const bedrooms = bedroomMatch ? parseInt(bedroomMatch[1], 10) : null;
  const budget = numberFromCroreLakh(lower);
  const parkingRequired = /\bparking\b|\bcar\s*porch\b|\bgarage\b/.test(lower);
  const furnishedRequired = /\bfurnished\b/.test(lower) && !/\bunfurnished\b/.test(lower);

  return { purpose, location, propertyType, bedrooms, budget, parkingRequired, furnishedRequired, raw: text };
};

export const scoreProperty = (property, criteria) => {
  let score = 0;
  let maxScore = 0;
  const reasons = [];
  const mismatches = [];

  maxScore += 10;
  if (property.purpose === criteria.purpose) score += 10;

  if (criteria.location) {
    maxScore += 25;
    if (property.location.area.toLowerCase() === criteria.location.toLowerCase()) {
      score += 25;
      reasons.push("Preferred location");
    } else {
      mismatches.push(`Located in ${property.location.area} instead of ${criteria.location}`);
    }
  }

  if (criteria.propertyType) {
    maxScore += 15;
    if (property.propertyType === criteria.propertyType) {
      score += 15;
      reasons.push(`Matches ${criteria.propertyType} type`);
    } else {
      mismatches.push(`This is a ${property.propertyType}, not a ${criteria.propertyType}`);
    }
  }

  if (criteria.bedrooms) {
    maxScore += 20;
    if (property.bedrooms === criteria.bedrooms) {
      score += 20;
      reasons.push(`${criteria.bedrooms} bedrooms`);
    } else if (property.bedrooms > criteria.bedrooms) {
      score += 12;
      reasons.push(`${property.bedrooms} bedrooms (more than requested)`);
    } else {
      mismatches.push(`Only ${property.bedrooms} bedroom(s), you asked for ${criteria.bedrooms}`);
    }
  }

  if (criteria.budget) {
    maxScore += 25;
    if (property.price <= criteria.budget) {
      score += 25;
      reasons.push("Within budget");
    } else {
      const overBy = property.price - criteria.budget;
      const pctOver = overBy / criteria.budget;
      if (pctOver <= 0.15) score += 12;
      mismatches.push(
        `Priced at PKR ${(property.price / 10000000).toFixed(2)} crore, which is over your budget`
      );
    }
  }

  if (criteria.parkingRequired) {
    maxScore += 5;
    if (property.parking) {
      score += 5;
      reasons.push("Parking available");
    } else {
      mismatches.push("No parking available");
    }
  }

  if (criteria.furnishedRequired) {
    maxScore += 5;
    if (property.furnished === "furnished") {
      score += 5;
      reasons.push("Furnished");
    } else {
      mismatches.push("Not furnished");
    }
  }

  maxScore += 5;
  if (property.isVerified) score += 5;

  const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
  return { matchScore: percentage, reasons, mismatches };
};
