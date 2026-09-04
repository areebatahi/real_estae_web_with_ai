import mongoose from "mongoose";
import slugify from "slugify";

const nearbyPlaceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    category: {
      type: String,
      enum: ["school", "hospital", "market", "restaurant", "transport", "other"],
      default: "other",
    },
    distanceKm: { type: Number, required: true },
  },
  { _id: false }
);

const propertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },

    purpose: { type: String, enum: ["buy", "rent"], required: true },
    propertyType: {
      type: String,
      enum: ["house", "apartment", "plot", "commercial"],
      required: true,
    },

    price: { type: Number, required: true }, // PKR
    rentFrequency: { type: String, enum: ["monthly", "yearly", null], default: null },

    location: {
      area: { type: String, required: true }, // e.g. DHA Lahore
      address: { type: String, default: "" },
      city: { type: String, default: "Lahore" },
    },

    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },

    area: {
      value: { type: Number, required: true },
      unit: { type: String, enum: ["Marla", "Kanal", "Sq.Ft"], default: "Marla" },
    },

    bedrooms: { type: Number, default: 0 },
    bathrooms: { type: Number, default: 0 },
    parking: { type: Boolean, default: false },
    furnished: { type: String, enum: ["furnished", "semi-furnished", "unfurnished"], default: "unfurnished" },

    amenities: [{ type: String }],

    images: [{ type: String }],
    videoUrl: { type: String, default: "" },
    tour360Url: { type: String, default: "" },

    nearbyPlaces: [nearbyPlaceSchema],

    agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },

    isVerified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
    },

    availabilityStatus: {
      type: String,
      enum: ["available", "confirmed_today", "pending_confirmation", "sold", "rented"],
      default: "pending_confirmation",
    },
    availabilityConfirmedAt: { type: Date },

    status: { type: String, enum: ["draft", "published"], default: "published" },

    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

propertySchema.index({ "location.area": 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ propertyType: 1 });
propertySchema.index({ purpose: 1 });
propertySchema.index({ bedrooms: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ isVerified: 1 });
propertySchema.index({ title: "text", description: "text" });

propertySchema.pre("validate", function (next) {
  if (this.title && (!this.slug || this.isModified("title"))) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;
  }
  next();
});

export default mongoose.model("Property", propertySchema);
