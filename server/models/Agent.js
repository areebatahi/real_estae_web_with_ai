import mongoose from "mongoose";

const agentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    photo: { type: String, default: "" },
    phone: { type: String, required: true },
    whatsapp: { type: String, required: true },
    email: { type: String, trim: true, lowercase: true },
    position: { type: String, default: "Property Consultant" },
    experience: { type: Number, default: 1 }, // years
    bio: { type: String, default: "" },
    isVerified: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Agent", agentSchema);
