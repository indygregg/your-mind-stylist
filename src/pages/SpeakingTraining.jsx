import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

export default function SpeakingTraining() {
  const outcomes = [
    "Navigate change",
    "Resolve conflict",
    "Improve communication",
    "Elevate performance",
    "Reduce burnout",
    "Strengthen leadership identity",
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
            For Organizations
          </span>
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
            Speaking & Training
          </h1>
          <p className="text-[#1E3A32] text-xl italic mb-8">
            Transform how your team communicates, thinks, and leads.
          </p>
          <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-8">
            I design workshops, trainings, and keynotes for teams and organizations who want to build
            cultures of emotional intelligence, clarity, and effective communication.
          </p>

          <div className="bg-white p-8 mb-12">
            <h3 className="font-serif text-xl text-[#1E3A32] mb-6">Help your team:</h3>
            <div className="grid grid-cols-2 gap-3">
              {outcomes.map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <Check size={16} className="text-[#D8B46B]" />
                  <span className="text-[#2B2725]/80">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to={createPageUrl("Contact")}
            className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide"
          >
            Book Roberta to Speak
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </div>
  );
}