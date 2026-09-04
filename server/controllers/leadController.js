import Lead from "../models/Lead.js";

export const getLeads = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.leadType) filter.leadType = req.query.leadType;

    const leads = await Lead.find(filter)
      .populate("propertyId", "title slug price location")
      .populate("assignedAgent", "name")
      .sort({ createdAt: -1 });

    res.json({ success: true, count: leads.length, data: leads });
  } catch (err) {
    next(err);
  }
};

export const createLead = async (req, res, next) => {
  try {
    const lead = await Lead.create(req.body);
    res.status(201).json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};

export const updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!lead) {
      res.status(404);
      throw new Error("Lead not found");
    }
    res.json({ success: true, data: lead });
  } catch (err) {
    next(err);
  }
};
