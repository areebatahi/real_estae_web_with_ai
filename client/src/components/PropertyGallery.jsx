import { useState } from "react";
import { ChevronLeft, ChevronRight, Image, Video, View } from "lucide-react";

export default function PropertyGallery({ images = [], videoUrl, tour360Url }) {
  const [tab, setTab] = useState("photos");
  const [index, setIndex] = useState(0);

  const next = () => setIndex((i) => (i + 1) % images.length);
  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

  return (
    <div className="overflow-hidden rounded-2xl border border-charcoal-100">
      <div className="flex gap-1 border-b border-charcoal-100 bg-charcoal-50 p-1.5">
        {[
          { key: "photos", label: "Photos", icon: Image },
          { key: "video", label: "Video", icon: Video, disabled: !videoUrl },
          { key: "tour", label: "360° Tour", icon: View, disabled: !tour360Url },
        ].map((t) => (
          <button
            key={t.key}
            disabled={t.disabled}
            onClick={() => setTab(t.key)}
            className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-30 ${
              tab === t.key ? "bg-white text-charcoal-900 shadow-sm" : "text-charcoal-500"
            }`}
          >
            <t.icon size={13} /> {t.label}
          </button>
        ))}
      </div>

      {tab === "photos" && (
        <div className="relative aspect-video bg-charcoal-900">
          <img src={images[index]} alt="" className="h-full w-full object-cover" />
          {images.length > 1 && (
            <>
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 hover:bg-white"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 hover:bg-white"
              >
                <ChevronRight size={18} />
              </button>
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setIndex(i)}
                    className={`h-1.5 rounded-full transition-all ${
                      i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {tab === "video" && videoUrl && (
        <div className="aspect-video">
          <iframe
            src={videoUrl}
            title="Property video"
            className="h-full w-full"
            allowFullScreen
          />
        </div>
      )}

      {tab === "tour" && tour360Url && (
        <div className="aspect-video">
          <iframe src={tour360Url} title="360 tour" className="h-full w-full" allowFullScreen />
        </div>
      )}
    </div>
  );
}
