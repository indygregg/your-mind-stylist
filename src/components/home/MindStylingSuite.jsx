import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../../utils";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, User, Layers, Users } from "lucide-react";

export default function MindStylingSuite() {
  const services = [
    {
      icon: Layers,
      title: "Mind Styling Evolution™",
      tagline: "A three-part inner redesign for people ready for a new mental operating system.",
      description:
        "Most people try to change their lives from the outside in. This program helps you transform from the inside out.",
      phases: [
        {
          name: "Part I — Edit",
          text: "See the patterns. Name the truth. Reestablish your mental baseline.",
        },
        {
          name: "Part II — Tailor",
          text: "Remove what no longer fits. Let go of beliefs and emotional loops you've outgrown.",
        },
        {
          name: "Part III — Design",
          text: "Rehearse your future self. Build identity-level change.",
        },
      ],
      cta: "Explore Mind Styling Evolution",
      link: "Evolution",
      accent: "#1E3A32",
      bg: "bg-white",
    },
    {
      icon: User,
      title: "Private Mind Styling (1:1)",
      tagline: "Your personalized mind edit.",
      description:
        "This is the most intimate way to work with me. Together, we identify your core patterns, release outdated beliefs, and rebuild the mindset that matches the life you want to create. Ideal for tailored, accelerated transformation.",
      cta: "Learn About Private Mind Styling",
      link: "PrivateSessions",
      accent: "#6E4F7D",
      bg: "bg-[#F9F5EF]",
    },
    {
      icon: Sparkles,
      title: "Pocket Mindset™ Sessions",
      tagline: "Reset your mind. Rehearse your future self. Shift your emotional state in minutes.",
      description:
        "Short, powerful guided experiences that help you regulate your nervous system, dissolve stress, and embody the identity you're growing into.",
      bullets: [
        "Overwhelm",
        "Emotional reactivity",
        "Confidence building",
        "Clarity & decision-making",
        "Performance preparation",
        "Identity expansion",
        "Deep rest & inner regulation",
      ],
      bottomNote:
        "Not meditation. Not napping. This is inner rehearsal—a fast, elegant way to shift your state and reset your mind.",
      cta: "Explore the Pocket Mindset Library",
      link: "InnerRehearsal",
      accent: "#A6B7A3",
      bg: "bg-[#A6B7A3]/10",
    },
    {
      icon: Users,
      title: "Organizational Mind Styling",
      tagline: "Transform how your team communicates, thinks, and leads.",
      description:
        "Workshops, trainings, and keynotes for teams and organizations who want to build cultures of emotional intelligence, clarity, and effective communication.",
      bullets: [
        "Navigate change",
        "Resolve conflict",
        "Improve communication",
        "Elevate performance",
        "Reduce burnout",
        "Strengthen leadership identity",
      ],
      cta: "Book Roberta to Speak",
      link: "SpeakingTraining",
      accent: "#1E3A32",
      bg: "bg-white",
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-[#E4D9C4]/30">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
            Signature Services
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32]">
            The Mind Styling Suite
          </h2>
        </motion.div>

        {/* Services Grid */}
        <div className="space-y-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={`${service.bg} p-8 md:p-12 lg:p-16 relative overflow-hidden group`}
            >
              {/* Decorative Corner */}
              <div
                className="absolute top-0 right-0 w-32 h-32 opacity-10"
                style={{ backgroundColor: service.accent }}
              />

              <div className="relative z-10">
                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-8"
                  style={{ backgroundColor: `${service.accent}15` }}
                >
                  <service.icon size={24} style={{ color: service.accent }} />
                </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
                  {/* Left Content */}
                  <div>
                    <h3 className="font-serif text-2xl md:text-3xl text-[#1E3A32] mb-4">
                      {service.title}
                    </h3>
                    <p
                      className="font-serif italic text-lg mb-6"
                      style={{ color: service.accent }}
                    >
                      {service.tagline}
                    </p>
                    <p className="text-[#2B2725]/80 leading-relaxed">{service.description}</p>
                  </div>

                  {/* Right Content */}
                  <div>
                    {/* Phases for Certification */}
                    {service.phases && (
                      <div className="space-y-6 mb-8">
                        {service.phases.map((phase) => (
                          <div key={phase.name} className="border-l-2 border-[#D8B46B] pl-6">
                            <h4 className="font-serif text-lg text-[#1E3A32] mb-1">
                              {phase.name}
                            </h4>
                            <p className="text-[#2B2725]/70 text-sm">{phase.text}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Bullets */}
                    {service.bullets && (
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-2">
                          {service.bullets.map((bullet) => (
                            <div key={bullet} className="flex items-center gap-2">
                              <div
                                className="w-1.5 h-1.5 rounded-full"
                                style={{ backgroundColor: service.accent }}
                              />
                              <span className="text-[#2B2725]/80 text-sm">{bullet}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Bottom Note */}
                    {service.bottomNote && (
                      <p className="text-[#2B2725]/60 text-sm italic mb-8">{service.bottomNote}</p>
                    )}

                    {/* CTA */}
                    <Link
                      to={createPageUrl(service.link)}
                      className="group/link inline-flex items-center gap-3 text-[#1E3A32] font-medium hover:gap-4 transition-all"
                    >
                      {service.cta}
                      <ArrowRight
                        size={18}
                        className="group-hover/link:translate-x-1 transition-transform"
                      />
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}