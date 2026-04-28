import React from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Globe, UserCheck, Clock } from "lucide-react";

const FILTER_CONFIG = [
  {
    key: "google",
    label: "Google Calendar",
    icon: Calendar,
    activeClass: "bg-slate-200 text-slate-800 border-slate-400",
    inactiveClass: "bg-white text-slate-500 border-slate-200 hover:bg-slate-50",
  },
  {
    key: "booking",
    label: "Website Bookings",
    icon: Globe,
    activeClass: "bg-emerald-100 text-emerald-800 border-emerald-400",
    inactiveClass: "bg-white text-emerald-600 border-emerald-200 hover:bg-emerald-50",
  },
  {
    key: "manual",
    label: "Manual Blocks",
    icon: UserCheck,
    activeClass: "bg-purple-100 text-purple-800 border-purple-400",
    inactiveClass: "bg-white text-purple-600 border-purple-200 hover:bg-purple-50",
  },
  {
    key: "available",
    label: "Available Hours",
    icon: Clock,
    activeClass: "bg-[#D8B46B]/30 text-[#1E3A32] border-[#D8B46B]",
    inactiveClass: "bg-white text-[#1E3A32]/60 border-[#E4D9C4] hover:bg-[#F9F5EF]",
  },
];

export default function CalendarFilters({ filters, onFilterChange, counts = {} }) {
  const toggleFilter = (key) => {
    onFilterChange({ ...filters, [key]: !filters[key] });
  };

  return (
    <div className="flex flex-wrap items-center gap-2 mb-4">
      <span className="text-sm text-[#2B2725]/60 mr-2">Show:</span>
      {FILTER_CONFIG.map(({ key, label, icon: Icon, activeClass, inactiveClass }) => (
        <button
          key={key}
          onClick={() => toggleFilter(key)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border rounded-full transition-all ${
            filters[key] ? activeClass : inactiveClass
          }`}
        >
          <Icon size={12} />
          <span>{label}</span>
          {counts[key] !== undefined && (
            <span className={`ml-1 px-1.5 py-0.5 rounded-full text-[10px] ${
              filters[key] ? "bg-white/50" : "bg-gray-100"
            }`}>
              {counts[key]}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}