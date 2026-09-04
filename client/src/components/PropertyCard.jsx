import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, BedDouble, Bath, Ruler, ShieldCheck, Scale } from "lucide-react";
import VerificationBadge from "./VerificationBadge";
import AvailabilityBadge from "./AvailabilityBadge";
import { formatPKR, formatArea } from "../utils/format";
import { useSavedProperties } from "../context/SavedPropertiesContext";
import { useCompare } from "../context/CompareContext";

export default function PropertyCard({ property, matchScore }) {
  const { isSaved, toggleSaved } = useSavedProperties();
  const { isComparing, toggleCompare, compareIds, maxCompare } = useCompare();
  const saved = isSaved(property._id);
  const comparing = isComparing(property._id);
  const compareDisabled = !comparing && compareIds.length >= maxCompare;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.35 }}
      className="card group overflow-hidden"
    >
      <div className="relative">
        <Link to={`/properties/${property.slug}`}>
          <div className="aspect-[4/3] w-full overflow-hidden bg-charcoal-100">
            <img
              src={property.images?.[0]}
              alt={property.title}
              loading="lazy"
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          </div>
        </Link>

        <button
          onClick={() => toggleSaved(property._id)}
          aria-label="Save property"
          className={`absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur transition ${
            saved ? "bg-emerald-600 text-white" : "bg-white/90 text-charcoal-700 hover:bg-white"
          }`}
        >
          <Heart size={16} fill={saved ? "currentColor" : "none"} />
        </button>

        {matchScore !== undefined && (
          <div className="absolute left-3 top-3 rounded-full bg-charcoal-900/90 px-3 py-1 text-xs font-bold text-white backdrop-blur">
            {matchScore}% Match
          </div>
        )}

        <div className="absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          <VerificationBadge isVerified={property.isVerified} />
          <AvailabilityBadge status={property.availabilityStatus} />
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p className="text-lg font-bold text-charcoal-900">{formatPKR(property.price)}
              {property.rentFrequency && <span className="text-xs font-medium text-charcoal-400">/{property.rentFrequency === "monthly" ? "mo" : "yr"}</span>}
            </p>
            <Link to={`/properties/${property.slug}`}>
              <h3 className="mt-0.5 line-clamp-1 text-sm font-semibold text-charcoal-800 hover:text-emerald-700">
                {property.title}
              </h3>
            </Link>
            <p className="mt-0.5 text-xs text-charcoal-500">
              {property.location.area}, Lahore
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-charcoal-600">
          {property.bedrooms > 0 && (
            <span className="inline-flex items-center gap-1">
              <BedDouble size={13} /> {property.bedrooms} Bed
            </span>
          )}
          {property.bathrooms > 0 && (
            <span className="inline-flex items-center gap-1">
              <Bath size={13} /> {property.bathrooms} Bath
            </span>
          )}
          <span className="inline-flex items-center gap-1">
            <Ruler size={13} /> {formatArea(property.area)}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between border-t border-charcoal-100 pt-3">
          <div className="flex items-center gap-1.5 text-xs text-charcoal-600">
            <ShieldCheck size={13} className={property.agent?.isVerified ? "text-blue-600" : "text-charcoal-300"} />
            {property.agent?.name || "Unassigned"}
          </div>
          <button
            onClick={() => toggleCompare(property._id)}
            disabled={compareDisabled}
            className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold transition ${
              comparing
                ? "bg-charcoal-900 text-white"
                : "bg-charcoal-100 text-charcoal-600 hover:bg-charcoal-200"
            } disabled:opacity-40`}
          >
            <Scale size={12} /> {comparing ? "Added" : "Compare"}
          </button>
        </div>

        <Link
          to={`/properties/${property.slug}`}
          className="btn-primary mt-4 w-full !py-2.5 text-xs"
        >
          View Property
        </Link>
      </div>
    </motion.div>
  );
}
