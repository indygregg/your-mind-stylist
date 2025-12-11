import React from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

export default function FreeMasterclass() {
  return (
    <div className="bg-[#1E3A32] min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
            Free Masterclass
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#F9F5EF] leading-tight mb-6">
            Imposter Syndrome
            <br />
            <span className="italic text-[#D8B46B]">& Other Myths to Ditch</span>
          </h1>
          <p className="text-[#F9F5EF]/80 text-lg max-w-2xl mx-auto mb-12">
            An on-demand masterclass for anyone who feels like they're "faking it."
            Learn what imposter syndrome really is, why it follows high performers,
            and how to break the loop for good.
          </p>

          <div className="aspect-video bg-[#2B2725] mb-8 flex items-center justify-center cursor-pointer group">
            <div className="w-24 h-24 rounded-full bg-[#D8B46B] flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play size={40} className="text-[#1E3A32] ml-1" fill="currentColor" />
            </div>
          </div>

          <p className="text-[#F9F5EF]/60 text-sm">
            Video content coming soon. Check back shortly.
          </p>
        </motion.div>
      </div>
    </div>
  );
}