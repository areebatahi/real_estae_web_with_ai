import Agent from "../models/Agent.js";

export const getAgents = async (req, res, next) => {
  try {
    const agents = await Agent.find({ isActive: true }).sort({ createdAt: -1 });
    res.json({ success: true, count: agents.length, data: agents });
  } catch (err) {
    next(err);
  }
};

export const getAgentById = async (req, res, next) => {
  try {
    const agent = await Agent.findById(req.params.id);
    if (!agent) {
      res.status(404);
      throw new Error("Agent not found");
    }
    res.json({ success: true, data: agent });
  } catch (err) {
    next(err);
  }
};

export const createAgent = async (req, res, next) => {
  try {
    const agent = await Agent.create(req.body);
    res.status(201).json({ success: true, data: agent });
  } catch (err) {
    next(err);
  }
};

export const updateAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!agent) {
      res.status(404);
      throw new Error("Agent not found");
    }
    res.json({ success: true, data: agent });
  } catch (err) {
    next(err);
  }
};

export const deleteAgent = async (req, res, next) => {
  try {
    const agent = await Agent.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!agent) {
      res.status(404);
      throw new Error("Agent not found");
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};
