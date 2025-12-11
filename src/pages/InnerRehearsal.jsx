import React from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { ArrowRight, Brain, Heart, Zap, Shield, Sparkles, Moon, Target, RefreshCw } from "lucide-react";

export default function InnerRehearsal() {
  const whatItCombines = [
    "Guided visualization",
    "Hypnotic language",
    "Emotional intelligence",
    "Future-self embodiment",
    "Nervous system regulation",
    "Identity rehearsal",
    "Pattern interruption",
    "Calm-state anchoring",
  ];

  const benefits = [
    {
      icon: RefreshCw,
      title: "Regulate your nervous system",
      description: "Lower emotional activation so you can think clearly.",
    },
    {
      icon: Zap,
      title: "Shift your internal state",
      description: "Move out of overwhelm, fear, or stress.",
    },
    {
      icon: Target,
      title: "Interrupt old patterns",
      description: "Gently disrupt the loops that keep you stuck.",
    },
    {
      icon: Heart,
      title: "Strengthen emotional intelligence",
      description: "Rewrite the meaning your mind assigns to experiences.",
    },
    {
      icon: Sparkles,
      title: "Rehearse your future self",
      description: "Practice confidence, clarity, and calm until they feel natural.",
    },
    {
      icon: Brain,
      title: "Build new identity pathways",
      description: "Create alignment between who you want to be and how you show up.",
    },
  ];

  const useCases = {
    feelings: [
      "Calmer",
      "Clearer",
      "More confident",
      "More grounded",
      "More emotionally regulated",
      "Better prepared",
      "Less overwhelmed",
      "More connected to yourself",
    ],
    moments: [
      "Before meetings or difficult conversations",
      "After emotional activation",
      "During stress, anxiety, or cognitive overload",
      "When you're stuck in overthinking",
      "When you need clarity for decisions",
      "Before sleep",
      "Before stepping into leadership moments",
      "During transition, doubt, or uncertainty",
    ],
  };

  const libraryCategories = [
    {
      icon: RefreshCw,
      title: "Calm & Nervous System Resets",
      description: "For instant grounding and emotional cooling.",
    },
    {
      icon: Sparkles,
      title: "Confidence & Identity Expansion",
      description: "For stepping into a stronger, clearer version of yourself.",
    },
    {
      icon: Brain,
      title: "Clarity & Decision Pathways",
      description: "For mental organization and cognitive calm.",
    },
    {
      icon: Heart,
      title: "Emotional Release Sessions",
      description: "For dissolving internal pressure and overwhelm.",
    },
    {
      icon: Target,
      title: "Performance Preparation",
      description: "For presentations, conversations, interviews, leadership moments.",
    },
    {
      icon: Moon,
      title: "Rest & Recovery",
      description: "For deep rest, nervous system repair, and nighttime decompression.",
    },
  ];

  const howItWorks = [
    {
      step: "Create your account",
      description: "Sign up directly through the portal.",
    },
    {
      step: "Choose your sessions",
      description: "Access the full library immediately.",
    },
    {
      step: "Listen anytime",
      description: "Use them before meetings, during transitions, or before sleep.",
    },
    {
      step: "Track your favorites",
      description: "Your dashboard saves recent and favorite sessions.",
    },
  ];

  return (
    <div className="bg-[#F9F5EF]">
      <SEO
        title="Pocket Mindset™ | Calm, Clarity & Identity Shifts"
        description="Short, powerful guided Pocket Mindset™ sessions to reset your mind, regulate your nervous system, and rehearse your future self in minutes."
        canonical="/inner-rehearsal"
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
              Guided Experiences
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6 text-center">
              Pocket Visualization™
            </h1>
            <p className="text-[#A6B7A3] font-serif text-2xl md:text-3xl italic mb-8 text-center">
              Reset your mind, regulate your nervous system, and rehearse your future self — in minutes.
            </p>

            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-10 max-w-3xl mx-auto text-center">
              These short, powerful audio-guided experiences help you shift your emotional state, calm
              your mind, dissolve overwhelm, and embody new patterns with ease. They're designed for
              real people with real lives — people who want to feel better, think clearly, and step
              into a more aligned version of themselves.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/app/signup?intent=inner-rehearsal"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
              >
                Access Pocket Visualization
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to={createPageUrl("Contact")}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#D8B46B]/10 transition-all duration-300"
              >
                Schedule a Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What Inner Rehearsal Is */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32] mb-8">
              What Is Pocket Visualization™?
            </h2>

            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-8">
              Unlike meditation, motivation, or passive relaxation, Pocket Visualization™ combines:
            </p>

            <div className="grid md:grid-cols-2 gap-3 mb-10">
              {whatItCombines.map((item) => (
                <div key={item} className="flex items-center gap-3 bg-[#F9F5EF] p-4">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#A6B7A3]" />
                  <span className="text-[#2B2725]/80">{item}</span>
                </div>
              ))}
            </div>

            <div className="space-y-6 text-[#2B2725]/80 text-lg leading-relaxed">
              <p className="font-serif text-xl text-[#1E3A32] italic">
                This isn't about escaping life — it's about preparing your mind and body to engage
                with it more clearly.
              </p>
              <p>
                Each session guides you into a quiet, receptive mental space where your subconscious
                becomes open to new ways of thinking, feeling, and responding.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why This Works */}
      <section className="py-24 bg-[#F9F5EF]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32] mb-6">
              Why Pocket Visualization™ Works
            </h2>
            <p className="text-[#2B2725]/80 text-lg leading-relaxed max-w-3xl mx-auto">
              Your subconscious mind doesn't distinguish vividly imagined experience from lived
              experience. This is why elite performers, executives, athletes, and creators use mental
              rehearsal to achieve peak clarity.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {benefits.map((benefit, index) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8"
              >
                <div className="w-14 h-14 rounded-full bg-[#A6B7A3]/20 flex items-center justify-center mb-6">
                  <benefit.icon size={24} className="text-[#A6B7A3]" />
                </div>
                <h3 className="font-serif text-xl text-[#1E3A32] mb-3 flex items-start gap-2">
                  <span className="text-[#D8B46B] mt-1">✦</span>
                  {benefit.title}
                </h3>
                <p className="text-[#2B2725]/70 leading-relaxed">{benefit.description}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-center font-serif text-xl text-[#1E3A32] italic">
            This is transformation through repetition, safety, and inner alignment.
          </p>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32] mb-10">
              When to Use Pocket Visualization™
            </h2>

            <div className="bg-[#F9F5EF] p-10 mb-10">
              <p className="text-[#2B2725]/80 text-lg mb-6">
                You can use these sessions any time you want to feel:
              </p>
              <div className="grid md:grid-cols-2 gap-4">
                {useCases.feelings.map((feeling) => (
                  <div key={feeling} className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-[#A6B7A3]" />
                    <span className="text-[#2B2725]/80 text-lg">{feeling}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <p className="text-[#2B2725]/80 text-lg mb-6 font-medium">They're perfect for:</p>
              <div className="grid md:grid-cols-2 gap-4">
                {useCases.moments.map((moment) => (
                  <div key={moment} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#D8B46B] mt-2.5 flex-shrink-0" />
                    <span className="text-[#2B2725]/80">{moment}</span>
                  </div>
                ))}
              </div>
            </div>

            <p className="font-serif text-2xl text-[#1E3A32] italic text-center">
              A few minutes can shift your entire day.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What's Inside the Library */}
      <section className="py-24 bg-[#F9F5EF]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32] mb-4">
              What You'll Find Inside
            </h2>
            <p className="text-[#2B2725]/70 text-lg">
              The Pocket Visualization™ library includes categories like:
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            {libraryCategories.map((category, index) => (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8"
              >
                <div className="w-14 h-14 rounded-full bg-[#A6B7A3]/20 flex items-center justify-center mb-6">
                  <category.icon size={24} className="text-[#A6B7A3]" />
                </div>
                <h3 className="font-serif text-xl text-[#1E3A32] mb-3 flex items-start gap-2">
                  <span className="text-[#D8B46B] mt-1">✦</span>
                  {category.title}
                </h3>
                <p className="text-[#2B2725]/70 leading-relaxed">{category.description}</p>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-[#2B2725]/70 text-lg italic">
            New sessions are added regularly.
          </p>
        </div>
      </section>

      {/* How to Access */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#1E3A32] mb-12">
              How It Works
            </h2>

            <div className="space-y-8 mb-10">
              {howItWorks.map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-6"
                >
                  <div className="w-12 h-12 rounded-full bg-[#A6B7A3]/20 flex items-center justify-center flex-shrink-0 text-[#1E3A32] font-serif text-xl">
                    {index + 1}
                  </div>
                  <div className="pt-2">
                    <h3 className="font-serif text-xl text-[#1E3A32] mb-2 flex items-start gap-2">
                      <span className="text-[#D8B46B]">✦</span>
                      {step.step}
                    </h3>
                    <p className="text-[#2B2725]/80 text-lg">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="bg-[#F9F5EF] p-8 mb-10">
              <p className="text-[#2B2725]/80 text-lg text-center">
                Pocket Visualization™ lives inside your private Your Mind Stylist Portal.
              </p>
            </div>

            <div className="text-center">
              <Link
                to="/app/signup?intent=inner-rehearsal"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
              >
                Access Pocket Visualization
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* A Message From Roberta */}
      <section className="py-24 bg-[#A6B7A3]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#F9F5EF] mb-8">A Personal Note</h2>

            <div className="space-y-6 text-[#F9F5EF]/95 text-lg leading-relaxed">
              <p>
                Pocket Visualization™ sessions are the tools I wish more people had access to — simple,
                calming, and deeply effective. You don't need an hour of meditation or a week-long
                retreat to shift your internal state. You just need a few quiet minutes and a gentle
                guide.
              </p>
              <p>
                This work changes people because it helps them change how they feel — and when that
                changes, everything else follows.
              </p>
              <p className="font-serif text-xl italic pt-4">— Roberta Fernandez, Your Mind Stylist</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 bg-[#1E3A32]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#F9F5EF] leading-tight mb-6">
              Ready to Reset?
            </h2>

            <p className="text-[#F9F5EF]/80 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
              Experience what it feels like to shift your state quickly, calmly, and intentionally.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/app/signup?intent=inner-rehearsal"
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#F9F5EF] transition-all duration-300"
              >
                Access Pocket Visualization
                <ArrowRight
                  size={16}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </Link>
              <Link
                to={createPageUrl("Contact")}
                className="group inline-flex items-center justify-center gap-3 px-8 py-4 border border-[#D8B46B] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#D8B46B]/10 transition-all duration-300"
              >
                Schedule a Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}