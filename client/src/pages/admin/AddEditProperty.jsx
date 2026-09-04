import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "../../services/api";
import { AREAS, AMENITIES } from "../../data/properties";

const emptyForm = {
  title: "",
  description: "",
  purpose: "buy",
  propertyType: "house",
  price: "",
  rentFrequency: "",
  "location.area": AREAS[0],
  "location.address": "",
  "area.value": "",
  "area.unit": "Marla",
  bedrooms: "",
  bathrooms: "",
  parking: false,
  furnished: "unfurnished",
  amenities: [],
  images: "",
  videoUrl: "",
  tour360Url: "",
  isVerified: false,
  availabilityStatus: "pending_confirmation",
};

export default function AddEditProperty() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEdit) return;
    api.get(`/properties/${id}`).then((res) => {
      const p = res.data;
      setForm({
        title: p.title,
        description: p.description,
        purpose: p.purpose,
        propertyType: p.propertyType,
        price: p.price,
        rentFrequency: p.rentFrequency || "",
        "location.area": p.location.area,
        "location.address": p.location.address,
        "area.value": p.area.value,
        "area.unit": p.area.unit,
        bedrooms: p.bedrooms,
        bathrooms: p.bathrooms,
        parking: p.parking,
        furnished: p.furnished,
        amenities: p.amenities || [],
        images: (p.images || []).join(", "),
        videoUrl: p.videoUrl || "",
        tour360Url: p.tour360Url || "",
        isVerified: p.isVerified,
        availabilityStatus: p.availabilityStatus,
      });
    }).catch(() => setError("Could not load property — is the backend connected?"));
  }, [id, isEdit]);

  const update = (key, value) => setForm((f) => ({ ...f, [key]: value }));

  const toggleAmenity = (a) => {
    setForm((f) => ({
      ...f,
      amenities: f.amenities.includes(a) ? f.amenities.filter((x) => x !== a) : [...f.amenities, a],
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = {
        title: form.title,
        description: form.description,
        purpose: form.purpose,
        propertyType: form.propertyType,
        price: Number(form.price),
        rentFrequency: form.purpose === "rent" ? (form.rentFrequency || "monthly") : null,
        location: { area: form["location.area"], address: form["location.address"], city: "Lahore" },
        area: { value: Number(form["area.value"]), unit: form["area.unit"] },
        bedrooms: Number(form.bedrooms) || 0,
        bathrooms: Number(form.bathrooms) || 0,
        parking: form.parking,
        furnished: form.furnished,
        amenities: form.amenities,
        images: form.images.split(",").map((s) => s.trim()).filter(Boolean),
        videoUrl: form.videoUrl,
        tour360Url: form.tour360Url,
        isVerified: form.isVerified,
        verificationStatus: form.isVerified ? "verified" : "pending",
        availabilityStatus: form.availabilityStatus,
      };

      if (isEdit) {
        await api.put(`/properties/${id}`, payload);
      } else {
        await api.post("/properties", payload);
      }
      navigate("/admin/properties");
    } catch (err) {
      setError(err.message || "Could not save property — connect the backend to manage listings.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-semibold text-charcoal-900">
        {isEdit ? "Edit Property" : "Add Property"}
      </h1>
      <p className="mt-1 text-sm text-charcoal-500">
        This form writes to the live backend API — connect MongoDB and log in as admin to save changes.
      </p>

      <form onSubmit={submit} className="mt-6 space-y-5">
        <div>
          <label className="label">Title</label>
          <input className="input-field" value={form.title} onChange={(e) => update("title", e.target.value)} required />
        </div>
        <div>
          <label className="label">Description</label>
          <textarea className="input-field" rows={4} value={form.description} onChange={(e) => update("description", e.target.value)} required />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Purpose</label>
            <select className="input-field" value={form.purpose} onChange={(e) => update("purpose", e.target.value)}>
              <option value="buy">Buy</option>
              <option value="rent">Rent</option>
            </select>
          </div>
          <div>
            <label className="label">Property Type</label>
            <select className="input-field" value={form.propertyType} onChange={(e) => update("propertyType", e.target.value)}>
              <option value="house">House</option>
              <option value="apartment">Apartment</option>
              <option value="plot">Plot</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Price (PKR)</label>
            <input type="number" className="input-field" value={form.price} onChange={(e) => update("price", e.target.value)} required />
          </div>
          {form.purpose === "rent" && (
            <div>
              <label className="label">Rent Frequency</label>
              <select className="input-field" value={form.rentFrequency} onChange={(e) => update("rentFrequency", e.target.value)}>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Area (Lahore)</label>
            <select className="input-field" value={form["location.area"]} onChange={(e) => update("location.area", e.target.value)}>
              {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Address</label>
            <input className="input-field" value={form["location.address"]} onChange={(e) => update("location.address", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Area Size</label>
            <input type="number" className="input-field" value={form["area.value"]} onChange={(e) => update("area.value", e.target.value)} />
          </div>
          <div>
            <label className="label">Unit</label>
            <select className="input-field" value={form["area.unit"]} onChange={(e) => update("area.unit", e.target.value)}>
              <option value="Marla">Marla</option>
              <option value="Kanal">Kanal</option>
              <option value="Sq.Ft">Sq.Ft</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="label">Bedrooms</label>
            <input type="number" className="input-field" value={form.bedrooms} onChange={(e) => update("bedrooms", e.target.value)} />
          </div>
          <div>
            <label className="label">Bathrooms</label>
            <input type="number" className="input-field" value={form.bathrooms} onChange={(e) => update("bathrooms", e.target.value)} />
          </div>
          <div>
            <label className="label">Furnishing</label>
            <select className="input-field" value={form.furnished} onChange={(e) => update("furnished", e.target.value)}>
              <option value="unfurnished">Unfurnished</option>
              <option value="semi-furnished">Semi-furnished</option>
              <option value="furnished">Furnished</option>
            </select>
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm font-medium text-charcoal-700">
          <input type="checkbox" checked={form.parking} onChange={(e) => update("parking", e.target.checked)} className="h-4 w-4 accent-emerald-600" />
          Parking Available
        </label>

        <div>
          <label className="label">Amenities</label>
          <div className="flex flex-wrap gap-2">
            {AMENITIES.map((a) => (
              <button type="button" key={a} onClick={() => toggleAmenity(a)}
                className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                  form.amenities.includes(a) ? "border-emerald-600 bg-emerald-50 text-emerald-700" : "border-charcoal-200 text-charcoal-600"
                }`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">Image URLs (comma-separated)</label>
          <textarea className="input-field" rows={2} value={form.images} onChange={(e) => update("images", e.target.value)} placeholder="https://..., https://..." />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="label">Video URL (optional)</label>
            <input className="input-field" value={form.videoUrl} onChange={(e) => update("videoUrl", e.target.value)} />
          </div>
          <div>
            <label className="label">360° Tour URL (optional)</label>
            <input className="input-field" value={form.tour360Url} onChange={(e) => update("tour360Url", e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <label className="flex items-center gap-2 text-sm font-medium text-charcoal-700">
            <input type="checkbox" checked={form.isVerified} onChange={(e) => update("isVerified", e.target.checked)} className="h-4 w-4 accent-emerald-600" />
            Mark as Verified
          </label>
          <div>
            <label className="label">Availability</label>
            <select className="input-field" value={form.availabilityStatus} onChange={(e) => update("availabilityStatus", e.target.value)}>
              <option value="pending_confirmation">Pending Confirmation</option>
              <option value="available">Available</option>
              <option value="confirmed_today">Availability Confirmed Today</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
            </select>
          </div>
        </div>

        {error && <p className="text-xs font-medium text-red-600">{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary">
          {saving ? "Saving..." : isEdit ? "Update Property" : "Publish Property"}
        </button>
      </form>
    </div>
  );
}
