import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: "Property" },
    leadType: {
      type: String,
      enum: [
        "property_inquiry",
        "whatsapp_click",
        "call_request",
        "visit_request",
        "information_request",
        "ai_property_search",
      ],
      required: true,
    },
    message: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "contacted", "visit_scheduled", "visited", "interested", "closed", "lost"],
      default: "new",
    },
    assignedAgent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" },
    source: { type: String, default: "website" },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", leadSchema);
