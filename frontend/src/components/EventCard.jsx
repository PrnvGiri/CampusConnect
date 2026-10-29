import React from "react";

const EVENT_IMAGES = {
  "AI Build Night": "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&auto=format&fit=crop&q=80",
  "Robotics Sprint": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
  "Open Source Jam": "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80"
};

export default function EventCard({ event, onSelect }) {
  const imageUrl = EVENT_IMAGES[event.title] || "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=80";

  return (
    <article className="bg-white border border-[#e2e8f0] rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col justify-between">
      <div>
        {/* Card Header Image */}
        <div className="relative h-44 w-full overflow-hidden bg-[#e6eeff]">
          <img
            src={imageUrl}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2.5 py-0.5 bg-white/90 backdrop-blur-sm rounded-full text-[11px] font-bold text-[#5442de] uppercase tracking-wider shadow-sm">
              Workshop
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-0.5 bg-[#0d1c2e]/80 text-white backdrop-blur-sm rounded-full text-[11px] font-semibold">
              Cap: {event.capacity}
            </span>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5">
          <h3 className="font-bold text-lg text-[#0d1c2e] leading-snug line-clamp-1">
            {event.title}
          </h3>

          <div className="mt-3 space-y-1.5 text-xs text-[#475569]">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#6d5ef8]">calendar_today</span>
              <span>Next Workshop Session</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-[#6d5ef8]">location_on</span>
              <span>Main Campus Center</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card Action */}
      <div className="p-5 pt-0">
        <button
          onClick={() => onSelect(event.id)}
          className="w-full py-2.5 px-4 rounded-lg bg-[#6d5ef8] hover:bg-[#5442de] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <span>View Details</span>
          <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
        </button>
      </div>
    </article>
  );
}

