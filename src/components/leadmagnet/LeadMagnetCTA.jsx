import React from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Download, CheckCircle } from "lucide-react";

export default function LeadMagnetCTA({ placement = "blog" }) {
  const filterKey = placement === "blog" ? "show_on_blog" : "show_on_homepage";

  const { data: items = [] } = useQuery({
    queryKey: ["leadMagnetCTA", placement],
    queryFn: () => base44.entities.LeadMagnet.filter({ [filterKey]: true, active: true }),
  });

  const item = items[0];
  if (!item) return null;

  return (
    <div className="my-10 bg-[#1E3A32] p-8 md:p-10">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        {item.thumbnail && (
          <img src={item.thumbnail} alt={item.title} className="w-24 h-24 object-cover flex-shrink-0" />
        )}
        <div className="flex-1 text-center md:text-left">
          <p className="text-[#D8B46B] text-xs tracking-[0.2em] uppercase mb-2">Free Download</p>
          <h3 className="font-serif text-2xl text-[#F9F5EF] mb-2">{item.title}</h3>
          {item.description && (
            <p className="text-[#F9F5EF]/70 text-sm mb-4">{item.description}</p>
          )}
          {item.benefits?.slice(0, 2).map((b, i) => (
            <div key={i} className="flex items-center gap-2 text-[#F9F5EF]/80 text-sm mb-1 justify-center md:justify-start">
              <CheckCircle size={14} className="text-[#D8B46B]" />
              {b}
            </div>
          ))}
        </div>
        <Link
          to={createPageUrl(`LeadMagnetPage?slug=${item.slug}`)}
          className="flex-shrink-0 inline-flex items-center gap-2 bg-[#D8B46B] text-[#1E3A32] px-6 py-3 text-sm font-medium tracking-wide hover:bg-[#C9A55A] transition-colors"
        >
          <Download size={16} />
          {item.cta_text || "Get It Free"}
        </Link>
      </div>
    </div>
  );
}