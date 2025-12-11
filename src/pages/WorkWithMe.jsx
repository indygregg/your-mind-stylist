import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { ArrowRight, Layers, User, Sparkles, Users } from "lucide-react";

export default function WorkWithMe() {
  const offerings = [
    {
      icon: Layers,
      title: "The Mind Styling Certification™",
      description: "A three-part inner redesign for a new mental operating system.",
      link: "Certification",
    },
    {
      icon: User,
      title: "Private Mind Styling (1:1)",
      description: "Your personalized mind edit with tailored, accelerated transformation.",
      link: "PrivateSessions",
    },
    {
      icon: Sparkles,
      title: "The Inner Rehearsal Sessions™",
      description: "Reset your mind and shift your emotional state in minutes.",
      link: "InnerRehearsal",
    },
    {
      icon: Users,
      title: "Organizational Mind Styling",
      description: "Transform how your team communicates, thinks, and leads.",
      link: "SpeakingTraining",
    },
  ];

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
            Work With Me
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1E3A32] leading-tight mb-6">
            Ways to Work Together
          </h1>
          <p className="text-[#2B2725]/80 text-lg max-w-2xl mx-auto">
            Choose the path that fits your transformation journey.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {offerings.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={createPageUrl(item.link)}
                className="block bg-white p-8 h-full group hover:shadow-lg transition-all"
              >
                <item.icon size={32} className="text-[#D8B46B] mb-4" />
                <h3 className="font-serif text-2xl text-[#1E3A32] mb-3">{item.title}</h3>
                <p className="text-[#2B2725]/70 mb-6">{item.description}</p>
                <span className="text-[#1E3A32] font-medium group-hover:text-[#D8B46B] transition-colors flex items-center gap-2">
                  Learn More <ArrowRight size={16} />
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}