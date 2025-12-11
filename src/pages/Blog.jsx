import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Calendar } from "lucide-react";

export default function Blog() {
  return (
    <div className="bg-[#F9F5EF] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
            Insights
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
            Thoughts & Reflections
          </h1>
          <p className="text-[#2B2725]/80 text-lg max-w-2xl mx-auto">
            Weekly insights for your mind styling journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8">
            <div className="flex items-center gap-2 mb-4">
              <Calendar size={16} className="text-[#D8B46B]" />
              <span className="text-[#D8B46B] text-sm">Monday Mentions</span>
            </div>
            <h3 className="font-serif text-xl text-[#1E3A32] mb-3">
              Short weekly insights to begin your week with intention.
            </h3>
            <p className="text-[#2B2725]/60">Content coming soon.</p>
          </div>

          <div className="bg-white p-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={16} className="text-[#6E4F7D]" />
              <span className="text-[#6E4F7D] text-sm">Thursday Thoughts</span>
            </div>
            <h3 className="font-serif text-xl text-[#1E3A32] mb-3">
              Reflective ideas to carry into the weekend.
            </h3>
            <p className="text-[#2B2725]/60">Content coming soon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}