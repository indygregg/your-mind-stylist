import React, { useState } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { motion, AnimatePresence } from "framer-motion";

const serviceColumns = [
  {
    heading: "Transformational Programs",
    items: [
      { name: "Tools and Programs", page: "Programs", description: "Explore all offerings", icon: "🧰" },
      { name: "LENS™", page: "LENS", description: "Flagship Mind Styling framework", icon: "🔍" },
      { name: "Cleaning Out Your Closet", page: "CleaningOutYourCloset", description: "One-on-one hypnosis work", icon: "🧹" },
      { name: "Pocket Mindset™", page: "PocketMindset", description: "Daily guided experiences", icon: "🎧" },
    ],
  },
  {
    heading: "Professional Development",
    items: [
      { name: "Hypnosis Training", page: "LearnHypnosis", description: "Become a certified hypnotist", icon: "🎓" },
      { name: "Speaking & Training", page: "SpeakingTraining", description: "Mind Styling for Organizations", icon: "🎤" },
      { name: "Signature Services", page: "SignatureServices", description: "Premium transformational packages", icon: "✨" },
    ],
  },
  {
    heading: "Webinars & Live Events",
    items: [
      { name: "Free Masterclass", page: "FreeMasterclass", description: "Start your transformation journey", icon: "🎬" },
      { name: "Upcoming Webinars", page: "ProgramsWebinars", description: "Live interactive sessions", icon: "📺" },
      { name: "Book a Session", page: "Bookings", description: "Private or group sessions", icon: "📅" },
      { name: "Initial Consultation", page: "Consultations", description: "Complimentary intake session", icon: "💬" },
    ],
  },
];

export default function ServicesMegaMenu({ isOpen }) {
  const [hoveredItem, setHoveredItem] = useState(null);

  // Default to first item of first column
  const allItems = serviceColumns.flatMap(col => col.items);
  const displayItem = hoveredItem || allItems[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.2 }}
          className="absolute top-full left-0 right-0 bg-white shadow-2xl border-t border-b border-[#E4D9C4] z-50"
        >
          <div className="max-w-7xl mx-auto px-8 py-8">
            <div className="grid grid-cols-4 gap-8">
              {/* Columns 1-3: Service links */}
              {serviceColumns.map((col, colIdx) => (
                <div key={colIdx} className="space-y-3">
                  <h3 className="text-[#D8B46B] text-xs tracking-[0.2em] uppercase mb-4">
                    {col.heading}
                  </h3>
                  {col.items.map((item) => (
                    <Link
                      key={item.page}
                      to={createPageUrl(item.page)}
                      onMouseEnter={() => setHoveredItem(item)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className="block group py-1"
                    >
                      <p className="text-[#1E3A32] font-medium text-sm group-hover:text-[#D8B46B] transition-colors leading-snug">
                        {item.name}
                      </p>
                      <p className="text-[#2B2725]/50 text-xs mt-0.5">
                        {item.description}
                      </p>
                    </Link>
                  ))}
                </div>
              ))}

              {/* Column 4: Preview card */}
              <div className="flex flex-col items-center justify-center gap-4">
                <AnimatePresence mode="wait">
                  {displayItem && (
                    <motion.div
                      key={displayItem.page}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <div className="w-[100px] h-[100px] bg-[#F9F5EF] rounded-lg flex items-center justify-center shadow-md border border-[#E4D9C4]">
                        <span className="text-4xl">{displayItem.icon}</span>
                      </div>
                      <p className="text-[#1E3A32] text-xs font-medium text-center max-w-[140px] leading-snug">
                        {displayItem.name}
                      </p>
                      <p className="text-[#2B2725]/50 text-[10px] text-center max-w-[140px] leading-snug">
                        {displayItem.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                <Link
                  to={createPageUrl("Programs")}
                  className="text-xs text-[#D8B46B] hover:text-[#1E3A32] transition-colors border-b border-[#D8B46B] pb-0.5 whitespace-nowrap mt-2"
                >
                  View All Services →
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}