import React from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { ArrowRight, Layers, User, Sparkles, Users, CheckCircle } from "lucide-react";

export default function WorkWithMe() {
  const offerings = [
    {
      overline: "Signature Program",
      icon: Layers,
      title: "Mind Styling Evolution™",
      tagline: "A three-part inner redesign for people ready for a new mental operating system.",
      description:
        "If you want to shift identity, break old patterns, and elevate your emotional intelligence, this is your foundational program. Through the Edit → Tailor → Design framework, you'll learn how to recognize, release, and restyle the patterns shaping your choices, relationships, and leadership.",
      perfectFor:
        "Individuals seeking meaningful change, leaders, professionals, creatives, and anyone tired of repeating old stories.",
      cta: "Explore Mind Styling Evolution",
      link: "Evolution",
      color: "#1E3A32",
      bg: "bg-white",
    },
    {
      overline: "Personalized Transformation",
      icon: User,
      title: "Private Mind Styling",
      tagline: "A highly tailored, one-on-one process for deep internal change.",
      description:
        "Private Mind Styling is for those who want direct, focused support in understanding and redesigning their personal patterns. We move through clarity, awareness, emotional intelligence, and identity-level shifts together—step by step.",
      perfectFor:
        "Individuals in transition, high performers, leaders, or anyone wanting a close, guided transformation.",
      cta: "Learn About Private Mind Styling",
      link: "PrivateSessions",
      color: "#6E4F7D",
      bg: "bg-[#F9F5EF]",
    },
    {
      overline: "Guided Experiences",
      icon: Sparkles,
      title: "The Inner Rehearsal Sessions™",
      tagline: "Reset your mind, regulate your nervous system, and rehearse your future self.",
      description:
        "Short, powerful audio-guided sessions designed to shift your emotional state in minutes. Use them for calm, clarity, confidence, focus, rest, performance preparation, or identity expansion.",
      perfectFor:
        "Busy minds, emotional overwhelm, overthinking, high-pressure moments, or anyone wanting quick internal alignment.",
      cta: "Explore the Inner Rehearsal Library",
      link: "InnerRehearsal",
      color: "#A6B7A3",
      bg: "bg-white",
    },
    {
      overline: "For Teams & Leaders",
      icon: Users,
      title: "Organizational Mind Styling",
      tagline: "Build healthier cultures, clearer communication, and emotionally intelligent leadership.",
      description:
        "I work with organizations seeking to transform the way their teams think and communicate. Through workshops, keynotes, or long-term training, we design experiences that improve clarity, collaboration, resilience, and performance.",
      perfectFor:
        "Leadership teams, departments, corporate groups, small and mid-size organizations.",
      cta: "Book Roberta to Speak",
      link: "SpeakingTraining",
      color: "#1E3A32",
      bg: "bg-[#F9F5EF]",
    },
  ];

  return (
    <div className="bg-[#F9F5EF]">
      <SEO
        title="Work With Me | Your Mind Stylist"
        description="Explore ways to work with Your Mind Stylist: certification, private sessions, Inner Rehearsal Sessions™, and organizational mind styling for teams and leaders."
        canonical="/work-with-me"
      />
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
              The Mind Styling Suite
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
              Work With Me
            </h1>
            <p className="text-[#2B2725]/80 text-xl leading-relaxed mb-10 max-w-3xl mx-auto">
              Whether you want deep personal transformation, a guided shift in your thinking, or
              organizational support for your team, there is a Mind Styling path designed for you.
            </p>
            <Link
              to={createPageUrl("Contact")}
              className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
            >
              Schedule Your Complimentary Consultation
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Overview Section */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-6">
              Choose Your Path
            </h2>
            <p className="text-[#2B2725]/80 text-lg leading-relaxed">
              Transformation can be gentle, structured, collaborative, or deeply internal. Each
              offering is designed to meet you exactly where you are—personally, professionally, or
              within your organization.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Offerings Sections */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="space-y-16">
            {offerings.map((offering, index) => (
              <motion.div
                key={offering.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className={`${offering.bg} p-10 md:p-14 lg:p-16 relative overflow-hidden`}
              >
                {/* Decorative Element */}
                <div
                  className="absolute top-0 right-0 w-40 h-40 rounded-full blur-3xl opacity-10"
                  style={{ backgroundColor: offering.color }}
                />

                <div className="relative z-10">
                  <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
                    {/* Left - Icon & Title */}
                    <div>
                      <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
                        {offering.overline}
                      </span>

                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                        style={{ backgroundColor: `${offering.color}15` }}
                      >
                        <offering.icon size={28} style={{ color: offering.color }} />
                      </div>

                      <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-4">
                        {offering.title}
                      </h2>

                      <p
                        className="font-serif italic text-xl mb-8"
                        style={{ color: offering.color }}
                      >
                        {offering.tagline}
                      </p>
                    </div>

                    {/* Right - Content */}
                    <div className="space-y-6">
                      <p className="text-[#2B2725]/80 text-lg leading-relaxed">
                        {offering.description}
                      </p>

                      {/* Perfect For */}
                      <div className="border-l-2 border-[#D8B46B] pl-6">
                        <p className="text-[#2B2725]/60 text-sm uppercase tracking-wide mb-2">
                          Perfect for:
                        </p>
                        <p className="text-[#2B2725]/80">{offering.perfectFor}</p>
                      </div>

                      {/* CTA */}
                      <Link
                        to={createPageUrl(offering.link)}
                        className="group/link inline-flex items-center gap-3 text-[#1E3A32] font-medium hover:gap-4 transition-all pt-4"
                      >
                        {offering.cta}
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

      {/* Final CTA Section */}
      <section className="py-24 bg-[#1E3A32]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#F9F5EF] leading-tight mb-6">
              Ready to Begin?
            </h2>

            <p className="text-[#F9F5EF]/80 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              Whether you're seeking personal change or support for your team, the first step is a
              conversation.
            </p>

            <Link
              to={createPageUrl("Contact")}
              className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#F9F5EF] transition-all duration-300"
            >
              Schedule Your Complimentary Consultation
              <ArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}