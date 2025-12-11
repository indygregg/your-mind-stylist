import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function PrivateSessions() {
  return (
    <div className="bg-[#F9F5EF] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
            1:1 Work
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
            Private Mind Styling
          </h1>
          <p className="text-[#6E4F7D] text-xl italic mb-8">Your personalized mind edit.</p>
          <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-12">
            This is the most intimate way to work with me. Together, we identify your core patterns,
            release outdated beliefs, and rebuild the mindset that matches the life you want to create.
            Ideal for individuals in transition, leaders, and creatives seeking tailored, accelerated transformation.
          </p>
          <Link
            to={createPageUrl("Contact")}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide"
          >
            Apply for Private Mind Styling
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}