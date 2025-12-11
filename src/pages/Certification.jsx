import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export default function Certification() {
  return (
    <div className="bg-[#F9F5EF] pt-32 pb-24">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
            Signature Program
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
            The Mind Styling Certification™
          </h1>
          <p className="text-[#2B2725]/80 text-xl max-w-2xl mx-auto italic">
            A three-part inner redesign for people ready for a new mental operating system.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {[
            { phase: "Part I", name: "Edit", desc: "See the patterns. Name the truth. Reestablish your mental baseline." },
            { phase: "Part II", name: "Tailor", desc: "Remove what no longer fits. Let go of beliefs you've outgrown." },
            { phase: "Part III", name: "Design", desc: "Rehearse your future self. Build identity-level change." },
          ].map((item, index) => (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white p-8 border-t-4 border-[#D8B46B]"
            >
              <span className="text-[#D8B46B] text-sm tracking-wide">{item.phase}</span>
              <h3 className="font-serif text-3xl text-[#1E3A32] my-4">{item.name}</h3>
              <p className="text-[#2B2725]/70">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Link
            to={createPageUrl("Contact")}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide"
          >
            Schedule a Call to Discuss
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}