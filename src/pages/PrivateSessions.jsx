import React from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { ArrowRight, Heart, Brain, Shield, Users, Compass, MessageCircle, Sparkles } from "lucide-react";

export default function PrivateSessions() {
  const workAreas = [
    {
      icon: Brain,
      title: "Your Internal Patterns",
      description: "Understanding the thinking loops, emotional triggers, and stories influencing your choices.",
    },
    {
      icon: Sparkles,
      title: "Identity & Confidence",
      description: "Rebuilding how you see yourself so you can move through life with grounded assurance.",
    },
    {
      icon: Heart,
      title: "Emotional Intelligence",
      description: "Learning to understand your reactions, communicate clearly, and navigate relationships more effectively.",
    },
    {
      icon: Shield,
      title: "Stress & Overwhelm",
      description: "Regulating your nervous system so you can think clearly under pressure.",
    },
    {
      icon: Compass,
      title: "Transitions & Life Shifts",
      description: "Whether it's career, personal, relational, or internal — we clarify your direction and rewrite the narrative.",
    },
    {
      icon: MessageCircle,
      title: "Boundaries, Communication & Clarity",
      description: "Finding your voice and learning how to express what you need without fear or reactivity.",
    },
    {
      icon: Users,
      title: "Future-Self Embodiment",
      description: "Learning to think as the version of yourself you've been growing toward.",
    },
  ];

  const howItWorks = [
    {
      title: "One-on-One Sessions",
      description: "Meet directly with Roberta in a confidential, supportive environment.",
    },
    {
      title: "Deep Pattern Identification",
      description: "We explore the thought structures and emotional loops that shape your experience.",
    },
    {
      title: "Mind Styling Tools",
      description: "You'll receive tailored tools, techniques, and Inner Rehearsal practices to support embodied change.",
    },
    {
      title: "Collaborative Direction",
      description: "We move through your goals, challenges, and transitions together with intention and clarity.",
    },
    {
      title: "Integration",
      description: "You'll practice new thinking, communication, and emotional intelligence skills in real time.",
    },
  ];

  const idealFor = [
    "Feel ready for a deeper level of internal clarity",
    "Are navigating transition or reinvention",
    "Tend to overthink or emotionally carry more than you want to",
    "Have patterns you've tried to change but can't seem to shift",
    "Want to strengthen your emotional intelligence",
    "Desire more alignment between your inner and outer life",
    "Prefer personalized, private, focused work",
  ];

  const outcomes = [
    "A clearer sense of self",
    "Emotional intelligence you can use instantly",
    "Tools for regulating stress, overwhelm, and reactivity",
    "Release of patterns that have been holding you back",
    "Confidence that feels grounded, not performative",
    "A more aligned and empowered identity",
    "A mindset that supports calm, clarity, and possibility",
  ];

  return (
    <div className="bg-[#F9F5EF]">
      <SEO
        title="Private Mind Styling | 1:1 Emotional Intelligence & Mindset Work"
        description="Work one-on-one with Your Mind Stylist, Roberta Fernandez, to understand your patterns, release what no longer fits, and redesign the way you think."
        canonical="/private-sessions"
      />
      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block text-center">
              Personalized Transformation
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6 text-center">
              Private Mind Styling
            </h1>
            <p className="text-[#6E4F7D] font-serif text-2xl md:text-3xl italic mb-8 text-center">
              A highly tailored, one-on-one process to help you understand your patterns, release
              what no longer fits, and redesign the way you think.
            </p>

            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-10 max-w-3xl mx-auto text-center">
              Private Mind Styling is for those who want a deeper, more intimate level of support — a
              space where you can explore your mindset, experiences, beliefs, and emotional patterns
              with clarity, compassion, and guidance.
            </p>

            <div className="text-center">
              <Link
                to={createPageUrl("Contact")}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
              >
                Schedule a Consultation
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Private Work */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32] mb-8">
              Sometimes You Need a Space
              <br />
              <span className="italic">That's Fully Yours</span>
            </h2>

            <div className="space-y-6 text-[#2B2725]/80 text-lg leading-relaxed">
              <p>
                Group programs and self-paced learning are powerful, but some transformations require
                a quieter room — one where the attention is entirely on you, your life, your patterns,
                and the shifts you're ready to make.
              </p>

              <p className="font-medium text-[#1E3A32]">Private Mind Styling is designed to help you:</p>
            </div>

            <div className="mt-8 grid md:grid-cols-2 gap-4">
              {[
                "Understand why certain patterns keep repeating",
                "Gain clarity on what you want and what's in the way",
                "Regulate your emotional and mental state",
                "Strengthen emotional intelligence",
                "Release old stories and self-concepts",
                "Move through transitions with calm and confidence",
                "Build a mindset that supports your goals",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6E4F7D] mt-2.5 flex-shrink-0" />
                  <span className="text-[#2B2725]/80">{item}</span>
                </div>
              ))}
            </div>

            <p className="mt-8 font-serif text-xl text-[#1E3A32] italic">
              This work is personal, gentle, and deeply impactful.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What We Work On */}
      <section className="py-24 bg-[#F9F5EF]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32] mb-4">
              What We Can Explore Together
            </h2>
            <p className="text-[#2B2725]/70 text-lg">Every session is tailored, but we often work on:</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {workAreas.map((area, index) => (
              <motion.div
                key={area.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 hover:shadow-lg transition-shadow duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-[#6E4F7D]/10 flex items-center justify-center mb-6">
                  <area.icon size={24} className="text-[#6E4F7D]" />
                </div>
                <h3 className="font-serif text-xl text-[#1E3A32] mb-3 flex items-start gap-2">
                  <span className="text-[#D8B46B] mt-1">✦</span>
                  {area.title}
                </h3>
                <p className="text-[#2B2725]/70 leading-relaxed">{area.description}</p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 text-center"
          >
            <p className="text-[#2B2725]/70 text-lg italic">
              This is not coaching in the traditional sense — it's a collaborative process rooted in
              emotional intelligence, narrative clarity, and subconscious integration.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32] mb-12">
              What Private Mind Styling Looks Like
            </h2>

            <div className="space-y-8">
              {howItWorks.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="border-l-2 border-[#D8B46B] pl-6"
                >
                  <h3 className="font-serif text-xl md:text-2xl text-[#1E3A32] mb-2 flex items-start gap-2">
                    <span className="text-[#D8B46B]">✦</span>
                    {item.title}
                  </h3>
                  <p className="text-[#2B2725]/80 text-lg leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>

            <p className="mt-10 font-serif text-2xl text-[#1E3A32] italic text-center">
              This is a partnership — not a prescription.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24 bg-[#6E4F7D]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#F9F5EF] mb-8">
              Is Private Mind Styling Right for You?
            </h2>

            <p className="text-[#F9F5EF]/90 text-lg mb-8">This path is ideal if you:</p>

            <div className="space-y-4 mb-10">
              {idealFor.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-start gap-3"
                >
                  <div className="w-2 h-2 rounded-full bg-[#D8B46B] mt-2.5 flex-shrink-0" />
                  <span className="text-[#F9F5EF]/90 text-lg">{item}</span>
                </motion.div>
              ))}
            </div>

            <p className="font-serif text-xl text-[#F9F5EF] italic">
              If you want a space to explore your mind, your story, and your next steps — this is it.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32] mb-10">
              What You Can Expect to Leave With
            </h2>

            <div className="grid md:grid-cols-2 gap-6">
              {outcomes.map((outcome, index) => (
                <motion.div
                  key={outcome}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-[#F9F5EF] p-6 flex items-start gap-3"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-[#6E4F7D] mt-2.5 flex-shrink-0" />
                  <span className="text-[#2B2725]/80 text-lg">{outcome}</span>
                </motion.div>
              ))}
            </div>

            <p className="mt-10 font-serif text-xl text-[#1E3A32] italic text-center">
              This work creates transformation that doesn't fade when things get hard.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Next Steps / Final CTA */}
      <section className="py-24 bg-[#1E3A32]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#F9F5EF] leading-tight mb-6">
              Your Private Work Begins
              <br />
              <span className="italic text-[#D8B46B]">With a Conversation</span>
            </h2>

            <p className="text-[#F9F5EF]/80 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              Private Mind Styling is a collaborative process. The best way to know if it's the right
              path is to speak directly.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={createPageUrl("Contact")}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#F9F5EF] transition-all duration-300"
              >
                Schedule Your Consultation
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to={createPageUrl("Contact")}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#D8B46B] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#D8B46B]/10 transition-all duration-300"
              >
                Ask a Question
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}