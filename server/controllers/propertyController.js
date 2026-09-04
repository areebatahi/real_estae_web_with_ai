import Property from "../models/Property.js";

// Build a Mongo filter object from query params
const buildFilter = (query) => {
  const filter = { status: "published" };

  if (query.purpose) filter.purpose = query.purpose;
  if (query.propertyType) filter.propertyType = query.propertyType;
  if (query.area) filter["location.area"] = new RegExp(query.area, "i");
  if (query.bedrooms) filter.bedrooms = { $gte: Number(query.bedrooms) };
  if (query.bathrooms) filter.bathrooms = { $gte: Number(query.bathrooms) };
  if (query.furnished) filter.furnished = query.furnished;
  if (query.parking === "true") filter.parking = true;
  if (query.verifiedOnly === "true") filter.isVerified = true;
  if (query.availableToday === "true") filter.availabilityStatus = "confirmed_today";

  if (query.minPrice || query.maxPrice) {
    filter.price = {};
    if (query.minPrice) filter.price.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.price.$lte = Number(query.maxPrice);
  }

  if (query.amenities) {
    const list = Array.isArray(query.amenities) ? query.amenities : query.amenities.split(",");
    filter.amenities = { $all: list };
  }

  if (query.q) {
    filter.$text = { $search: query.q };
  }

  return filter;
};

const buildSort = (sortKey) => {
  switch (sortKey) {
    case "newest":
      return { createdAt: -1 };
    case "price_low":
      return { price: 1 };
    case "price_high":
      return { price: -1 };
    case "area_large":
      return { "area.value": -1 };
    default:
      return { isVerified: -1, createdAt: -1 }; // best match / default
  }
};

// @desc  Get all properties with filters, sorting, pagination
// @route GET /api/properties
export const getProperties = async (req, res, next) => {
  try {
    const filter = buildFilter(req.query);
    const sort = buildSort(req.query.sort);
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;

    const [items, total] = await Promise.all([
      Property.find(filter)
        .populate("agent", "name photo phone whatsapp isVerified position")
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      Property.countDocuments(filter),
    ]);

    res.json({
      success: true,
      count: items.length,
      total,
      page,
      pages: Math.ceil(total / limit) || 1,
      data: items,
    });
  } catch (err) {
    next(err);
  }
};

// @desc  Get single property by id or slug
// @route GET /api/properties/:id
export const getPropertyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const query = id.match(/^[0-9a-fA-F]{24}$/) ? { _id: id } : { slug: id };
    const property = await Property.findOne(query).populate(
      "agent",
      "name photo phone whatsapp email position experience isVerified bio"
    );

    if (!property) {
      res.status(404);
      throw new Error("Property not found");
    }

    property.views += 1;
    await property.save();

    res.json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
};

// @desc  Create property
// @route POST /api/properties
export const createProperty = async (req, res, next) => {
  try {
    const property = await Property.create(req.body);
    res.status(201).json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
};

// @desc  Update property
// @route PUT /api/properties/:id
export const updateProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!property) {
      res.status(404);
      throw new Error("Property not found");
    }
    res.json({ success: true, data: property });
  } catch (err) {
    next(err);
  }
};

// @desc  Delete property
// @route DELETE /api/properties/:id
export const deleteProperty = async (req, res, next) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);
    if (!property) {
      res.status(404);
      throw new Error("Property not found");
    }
    res.json({ success: true, data: {} });
  } catch (err) {
    next(err);
  }
};

// @desc  Compare 2-4 properties by id
// @route GET /api/properties/compare?ids=a,b,c
export const compareProperties = async (req, res, next) => {
  try {
    const ids = (req.query.ids || "").split(",").filter(Boolean);
    if (ids.length < 2 || ids.length > 4) {
      res.status(400);
      throw new Error("Provide between 2 and 4 property ids to compare");
    }
    const properties = await Property.find({ _id: { $in: ids } }).populate(
      "agent",
      "name isVerified"
    );
    res.json({ success: true, data: properties });
  } catch (err) {
    next(err);
  }
};
