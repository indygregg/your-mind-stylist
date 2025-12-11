import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export default function InnerRehearsal() {
  const useCases = [
    "Overwhelm",
    "Emotional reactivity",
    "Confidence building",
    "Clarity & decision-making",
    "Performance preparation",
    "Identity expansion",
    "Deep rest & inner regulation",
  ];

  return (
    <div className="bg-[#F9F5EF] pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
            Guided Sessions
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
            The Inner Rehearsal Sessions™
          </h1>
          <p className="text-[#A6B7A3] text-xl italic mb-8">
            Reset your mind. Rehearse your future self. Shift your emotional state in minutes.
          </p>
          <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-8">
            Short, powerful guided experiences that help you regulate your nervous system,
            dissolve stress, and embody the identity you're growing into.
          </p>

          <div className="bg-white p-8 mb-12">
            <h3 className="font-serif text-xl text-[#1E3A32] mb-6">Perfect for:</h3>
            <div className="grid grid-cols-2 gap-3">
              {useCases.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check size={16} className="text-[#A6B7A3]" />
                  <span className="text-[#2B2725]/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <p className="text-[#2B2725]/60 italic mb-12">
            Not meditation. Not napping. This is inner rehearsal—a fast, elegant way to shift your state.
          </p>

          <Link
            to={createPageUrl("Contact")}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide"
          >
            Access The Inner Rehearsal Sessions
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}