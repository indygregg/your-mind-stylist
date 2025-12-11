import React from "react";
import SEO from "../components/SEO";
import { motion } from "framer-motion";
import { Headphones } from "lucide-react";

export default function Podcast() {
  return (
    <div className="bg-[#F9F5EF] pt-32 pb-24">
      <SEO
        title="Activated Dialogue Podcast | Your Mind Stylist"
        description="Deeper conversations about emotional intelligence, change, and conscious living with Your Mind Stylist, Roberta Fernandez."
        canonical="/podcast"
      />
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Headphones size={48} className="text-[#D8B46B] mx-auto mb-6" />
          <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
            Podcast
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
            Activated Dialogue
          </h1>
          <p className="text-[#2B2725]/80 text-lg max-w-2xl mx-auto mb-12">
            Deeper conversations about emotional intelligence, change, and conscious living.
          </p>

          <div className="bg-white p-12 text-center">
            <p className="text-[#2B2725]/60">
              Podcast episodes coming soon. Subscribe to stay updated.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}