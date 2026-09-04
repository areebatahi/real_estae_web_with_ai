import mongoose from "mongoose";

const visitSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    whatsapp: { type: String, default: "" },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property", required: true },
    preferredDate: { type: Date, required: true },
    preferredTime: { type: String, required: true },
    message: { type: String, default: "" },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Visit", visitSchema);
