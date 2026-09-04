import Property from "../models/Property.js";
import Lead from "../models/Lead.js";
import { extractQueryMock, extractQueryWithAnthropic, scoreProperty } from "../services/aiMatchService.js";

// @desc  Natural-language property matching
// @route POST /api/ai/property-match
// body: { query: string, name?, phone?, saveLead?: boolean }
export const propertyMatch = async (req, res, next) => {
  try {
    const { query, name, phone, saveLead } = req.body;
    if (!query || query.trim().length < 3) {
      res.status(400);
      throw new Error("Please describe what you're looking for");
    }

    const useAnthropic = process.env.AI_PROVIDER === "anthropic" && process.env.ANTHROPIC_API_KEY;
    const criteria = useAnthropic ? await extractQueryWithAnthropic(query) : extractQueryMock(query);

    const filter = { status: "published" };
    if (criteria.purpose) filter.purpose = criteria.purpose;

    const candidates = await Property.find(filter).populate(
      "agent",
      "name photo isVerified whatsapp phone"
    );

    const ranked = candidates
      .map((property) => {
        const { matchScore, reasons, mismatches } = scoreProperty(property, criteria);
        return { property, matchScore, reasons, mismatches };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 12);

    if (saveLead && name && phone) {
      await Lead.create({
        name,
        phone,
        leadType: "ai_property_search",
        message: query,
      });
    }

    res.json({
      success: true,
      criteria,
      count: ranked.length,
      data: ranked,
    });
  } catch (err) {
    next(err);
  }
};

// @desc  AI comparison assistant — "Help Me Decide"
// @route POST /api/ai/compare-assist
// body: { propertyIds: string[], preference?: string }
export const compareAssist = async (req, res, next) => {
  try {
    const { propertyIds, preference } = req.body;
    if (!Array.isArray(propertyIds) || propertyIds.length < 2) {
      res.status(400);
      throw new Error("Provide at least 2 property ids");
    }

    const properties = await Property.find({ _id: { $in: propertyIds } });

    const criteria = preference ? extractQueryMock(preference) : {};
    const scored = properties
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
      const priceDiff = Math.abs(winner.property.price - (runnerUp?.property.price || 0));
      summary = `${winner.property.title} in ${winner.property.location.area} offers the best overall balance of price, size, and verification among the selected properties.${
        runnerUp
          ? ` It differs from ${runnerUp.property.title} by roughly PKR ${(priceDiff / 100000).toFixed(1)} lakh.`
          : ""
      }`;
    }

    res.json({ success: true, summary, ranked: scored });
  } catch (err) {
    next(err);
  }
};
