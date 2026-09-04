import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, Scale, BedDouble, Bath, Ruler, Car, Sofa, CalendarDays } from "lucide-react";
import PropertyGallery from "../components/PropertyGallery";
import VerificationBadge from "../components/VerificationBadge";
import AvailabilityBadge from "../components/AvailabilityBadge";
import LocationMap from "../components/LocationMap";
import NearbyPlaces from "../components/NearbyPlaces";
import AgentCard from "../components/AgentCard";
import ScheduleVisitModal from "../components/ScheduleVisitModal";
import LeadForm from "../components/LeadForm";
import EmptyState from "../components/EmptyState";
import { formatPKR, formatArea } from "../utils/format";
import { dataService } from "../services/dataService";
import { useSavedProperties } from "../context/SavedPropertiesContext";
import { useCompare } from "../context/CompareContext";

const AMENITY_ICONS = {
  Parking: Car, Security: BedDouble, "Electricity Backup": BedDouble, Water: BedDouble,
  Balcony: Sofa, Garden: BedDouble, "Servant Quarter": BedDouble, CCTV: BedDouble, Elevator: BedDouble,
};

export default function PropertyDetail() {
  const { id } = useParams();
  const [property, setProperty] = useState(undefined);
  const [modalOpen, setModalOpen] = useState(false);
  const { isSaved, toggleSaved } = useSavedProperties();
  const { isComparing, toggleCompare } = useCompare();

  useEffect(() => {
    setProperty(undefined);
    dataService.getPropertyById(id).then(setProperty);
    window.scrollTo(0, 0);
  }, [id]);

  if (property === undefined) {
    return <div className="container-px mx-auto max-w-7xl py-24 text-center text-charcoal-400">Loading property...</div>;
  }

  if (!property) {
    return (
      <div className="container-px mx-auto max-w-7xl py-24">
        <EmptyState title="Property not available" subtitle="This listing may have been sold, rented, or removed." action={<Link to="/properties" className="btn-primary">Browse Properties</Link>} />
      </div>
    );
  }

  const saved = isSaved(property._id);
  const comparing = isComparing(property._id);

  return (
    <div className="container-px mx-auto max-w-7xl py-10">
      <nav className="mb-4 text-xs text-charcoal-400">
        <Link to="/properties" className="hover:text-emerald-600">Properties</Link> / {property.location.area} / <span className="text-charcoal-700">{property.title}</span>
      </nav>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          <PropertyGallery images={property.images} videoUrl={property.videoUrl} tour360Url={property.tour360Url} />

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <div>
              <div className="flex flex-wrap gap-2">
                <VerificationBadge isVerified={property.isVerified} size="md" />
                <AvailabilityBadge status={property.availabilityStatus} />
              </div>
              <h1 className="mt-3 font-display text-2xl font-bold text-charcoal-900 sm:text-3xl">{property.title}</h1>
              <p className="mt-1 text-sm text-charcoal-500">{property.location.address}, {property.location.area}, Lahore</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => toggleSaved(property._id)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border ${saved ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-charcoal-200 text-charcoal-600"}`}
              >
                <Heart size={18} fill={saved ? "currentColor" : "none"} />
              </button>
              <button
                onClick={() => toggleCompare(property._id)}
                className={`flex h-11 w-11 items-center justify-center rounded-full border ${comparing ? "border-charcoal-900 bg-charcoal-900 text-white" : "border-charcoal-200 text-charcoal-600"}`}
              >
                <Scale size={18} />
              </button>
            </div>
          </div>

          <p className="mt-4 font-display text-3xl font-bold text-charcoal-900">
            {formatPKR(property.price)}
            {property.rentFrequency && <span className="text-base font-medium text-charcoal-400"> /{property.rentFrequency === "monthly" ? "month" : "year"}</span>}
          </p>

          <div className="mt-6 grid grid-cols-2 gap-4 rounded-2xl border border-charcoal-100 p-5 sm:grid-cols-4">
            <Stat icon={BedDouble} label="Bedrooms" value={property.bedrooms || "—"} />
            <Stat icon={Bath} label="Bathrooms" value={property.bathrooms || "—"} />
            <Stat icon={Ruler} label="Area" value={formatArea(property.area)} />
            <Stat icon={Car} label="Parking" value={property.parking ? "Yes" : "No"} />
          </div>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-charcoal-900">Property Description</h2>
            <p className="mt-3 leading-relaxed text-charcoal-600">{property.description}</p>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-charcoal-900">Amenities</h2>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {property.amenities?.map((a) => {
                const Icon = AMENITY_ICONS[a] || Sofa;
                return (
                  <div key={a} className="flex items-center gap-2 rounded-xl border border-charcoal-100 px-3 py-2.5 text-sm text-charcoal-700">
                    <Icon size={15} className="text-emerald-600" /> {a}
                  </div>
                );
              })}
            </div>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold text-charcoal-900">Location & Nearby</h2>
            <div className="mt-4 space-y-4">
              <LocationMap area={property.location.area} address={property.location.address} />
              <NearbyPlaces places={property.nearbyPlaces} />
            </div>
          </section>
        </div>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <button onClick={() => setModalOpen(true)} className="btn-primary w-full">
            <CalendarDays size={16} /> Schedule Visit
          </button>
          <AgentCard agent={property.agent} propertyId={property._id} />
          <LeadForm leadType="property_inquiry" propertyId={property._id} title="Interested in this property?" />
        </div>
      </div>

      <ScheduleVisitModal open={modalOpen} onClose={() => setModalOpen(false)} property={property} />
    </div>
  );
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="text-center">
      <Icon className="mx-auto mb-1 text-emerald-600" size={18} />
      <p className="text-sm font-bold text-charcoal-900">{value}</p>
      <p className="text-[11px] text-charcoal-500">{label}</p>
    </div>
  );
}
