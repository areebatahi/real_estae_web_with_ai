import Visit from "../models/Visit.js";
import Lead from "../models/Lead.js";

export const getVisits = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const visits = await Visit.find(filter)
      .populate("propertyId", "title slug location")
      .populate("assignedAgent", "name")
      .sort({ preferredDate: 1 });

    res.json({ success: true, count: visits.length, data: visits });
  } catch (err) {
    next(err);
  }
};

export const createVisit = async (req, res, next) => {
  try {
    const visit = await Visit.create(req.body);

    // Also generate a lead so it shows up in lead management
    await Lead.create({
      name: visit.name,
      phone: visit.phone,
      propertyId: visit.propertyId,
      leadType: "visit_request",
      message: visit.message,
      status: "visit_scheduled",
    });

    res.status(201).json({ success: true, data: visit });
  } catch (err) {
    next(err);
  }
};

export const updateVisit = async (req, res, next) => {
  try {
    const visit = await Visit.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!visit) {
      res.status(404);
      throw new Error("Visit not found");
    }
    res.json({ success: true, data: visit });
  } catch (err) {
    next(err);
  }
};
