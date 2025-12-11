import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SEO from "../components/SEO";
import { 
  Brain, 
  Heart, 
  Users, 
  BookOpen, 
  Award, 
  CheckCircle, 
  ArrowRight,
  Sparkles,
  Target,
  MessageCircle
} from "lucide-react";

export default function LearnHypnosis() {
  return (
    <div className="bg-[#F9F5EF]">
      <SEO
        title="Learn Hypnosis | The Mind Stylist™"
        description="Become a confident, ethical, emotionally intelligent hypnotist using Roberta's signature Mind Styling™ approach to subconscious change. Perfect for beginners and professionals."
        canonical="/learn-hypnosis"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-b from-[#1E3A32] to-[#2B2725]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
              Hypnosis Training
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#F9F5EF] leading-tight mb-6">
              Learn Hypnosis with The Mind Stylist™
            </h1>
            <p className="text-[#F9F5EF]/90 text-xl md:text-2xl leading-relaxed mb-8 max-w-3xl mx-auto">
              Train your mind to guide others—and yourself—into calm, clarity, and emotional transformation.
            </p>
            <p className="text-[#F9F5EF]/80 text-lg leading-relaxed mb-6 max-w-3xl mx-auto">
              Become a confident, ethical, emotionally intelligent hypnotist using Roberta's signature Mind Styling™ approach to subconscious change.
            </p>
            <p className="text-[#D8B46B] text-base mb-10">
              Perfect for beginners, coaches, therapists, and anyone ready to help others reshape their inner world.
            </p>
            <Link
              to="/app/login"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#F9F5EF] transition-all duration-300"
            >
              Begin Your Training
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 1 — Why Learn Hypnosis with Roberta? */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Heart size={40} className="text-[#D8B46B] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-6">
                Why Learn Hypnosis with Roberta?
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-[#F9F5EF] p-8">
                <p className="text-[#2B2725]/60 text-lg mb-2">Most hypnosis trainings teach scripts.</p>
                <p className="font-serif text-2xl text-[#1E3A32]">Roberta teaches human understanding.</p>
              </div>
              <div className="bg-[#F9F5EF] p-8">
                <p className="text-[#2B2725]/60 text-lg mb-2">Most focus on what to say.</p>
                <p className="font-serif text-2xl text-[#1E3A32]">Roberta teaches you how to listen.</p>
              </div>
            </div>

            <div className="max-w-3xl mx-auto text-center mb-10">
              <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-6">
                This training goes beyond technique. It introduces you to the emotional, rhythmic, and relational art of helping someone change their mind—internally, safely, and effectively.
              </p>
              <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-6">
                You'll learn a modern, grounded approach rooted in:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                "Neuroscience",
                "Emotional repatterning",
                "Subconscious communication",
                "Therapeutic language",
                "Mind Styling™ principles",
                "Ethical, compassionate practice"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <CheckCircle size={20} className="text-[#A6B7A3] flex-shrink-0 mt-1" />
                  <p className="text-[#2B2725]">{item}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-[#1E3A32] font-serif text-xl mt-10 italic">
              This is hypnosis for people who want to facilitate transformation, not memorize dialogues.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2 — What You'll Learn */}
      <section className="py-24 bg-[#F9F5EF]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Brain size={40} className="text-[#D8B46B] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-4">
                What You'll Learn
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h3 className="font-serif text-2xl text-[#1E3A32] mb-6">Core Skills:</h3>
                <div className="space-y-4">
                  {[
                    "Understanding the subconscious mind",
                    "Safe, ethical trance induction",
                    "How to guide clients into focused inner states",
                    "Emotional state design (Mind Styling™ foundations)",
                    "How to restructure internal narratives",
                    "How to work with anxiety, performance, confidence, and habits",
                    "How to design custom sessions without scripts",
                    "How to incorporate hypnosis into coaching or therapeutic work"
                  ].map((skill, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-[#6E4F7D] flex-shrink-0 mt-1" />
                      <p className="text-[#2B2725]/80">{skill}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-serif text-2xl text-[#1E3A32] mb-6">Practical Application:</h3>
                <div className="space-y-4">
                  {[
                    "Live demos & practice sessions",
                    "Client session frameworks",
                    "How to create your own recorded hypnosis sessions",
                    "Troubleshooting difficult patterns",
                    "Creating emotional \"wardrobes\" that genuinely fit the client"
                  ].map((practice, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Target size={18} className="text-[#D8B46B] flex-shrink-0 mt-1" />
                      <p className="text-[#2B2725]/80">{practice}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3 — Who This Training Is For */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Users size={40} className="text-[#D8B46B] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-6">
                Who This Training Is For
              </h2>
              <p className="text-[#2B2725]/80 text-lg">This training is perfect for:</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-10">
              {[
                "New hypnotists",
                "Coaches & wellness practitioners",
                "Therapists",
                "Educators",
                "Yoga/meditation teachers",
                "Public speakers",
                "Corporate trainers",
                "Anyone who wants to guide others into clarity and internal alignment"
              ].map((audience, idx) => (
                <div
                  key={idx}
                  className="bg-[#F9F5EF] p-6 text-center border-l-4 border-[#D8B46B]"
                >
                  <p className="text-[#1E3A32] font-medium">{audience}</p>
                </div>
              ))}
            </div>

            <p className="text-center text-xl text-[#1E3A32] font-serif italic">
              Absolutely no prior experience is required.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 4 — What's Included */}
      <section className="py-24 bg-[#F9F5EF]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <BookOpen size={40} className="text-[#D8B46B] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-6">
                What's Included in the Training
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              {[
                "Full video-based course taught by Roberta",
                "Hypnosis demonstrations",
                "Practice exercises",
                "Client mapping templates",
                "Hypnosis scripts & customizable frameworks",
                "Office Hours or Q&A opportunities (depending on track)",
                "Access to The Mind Styling Studio™ for live practice",
                "Certificate of Completion (Certification Track only)"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-4">
                  <Sparkles size={20} className="text-[#6E4F7D] flex-shrink-0 mt-1" />
                  <p className="text-[#2B2725]/80">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 5 — Training Tracks */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <Award size={40} className="text-[#D8B46B] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-6">
                Training Tracks
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Certification Track */}
              <div className="bg-[#1E3A32] p-8 text-[#F9F5EF] relative">
                <div className="absolute top-6 right-6 bg-[#D8B46B] text-[#1E3A32] px-3 py-1 text-xs uppercase tracking-wide">
                  Recommended
                </div>
                <h3 className="font-serif text-2xl mb-4">Certification Track</h3>
                <p className="text-[#F9F5EF]/80 mb-6">
                  For those who want to practice hypnosis professionally.
                </p>

                <div className="space-y-3 mb-8">
                  <p className="text-sm font-medium text-[#D8B46B] mb-3">Includes:</p>
                  {[
                    "Full course access",
                    "Exams & supervised practice",
                    "Practitioner certificate",
                    "Listing in Mind Stylist network (optional)"
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-[#D8B46B] flex-shrink-0 mt-1" />
                      <p className="text-[#F9F5EF]/90">{feature}</p>
                    </div>
                  ))}
                </div>

                <Link
                  to="/app/login"
                  className="block w-full text-center px-6 py-3 bg-[#D8B46B] text-[#1E3A32] hover:bg-[#F9F5EF] transition-colors"
                >
                  Begin Certification →
                </Link>
              </div>

              {/* Audit Track */}
              <div className="bg-[#F9F5EF] p-8 border border-[#E4D9C4]">
                <h3 className="font-serif text-2xl text-[#1E3A32] mb-4">Audit Track</h3>
                <p className="text-[#2B2725]/80 mb-6">
                  For personal use or skill development without certification.
                </p>

                <div className="space-y-3 mb-8">
                  <p className="text-sm font-medium text-[#1E3A32] mb-3">Includes:</p>
                  {[
                    "Full content access",
                    "No exam",
                    "No practitioner listing"
                  ].map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-[#A6B7A3] flex-shrink-0 mt-1" />
                      <p className="text-[#2B2725]/80">{feature}</p>
                    </div>
                  ))}
                </div>

                <Link
                  to="/app/login"
                  className="block w-full text-center px-6 py-3 border border-[#1E3A32] text-[#1E3A32] hover:bg-[#1E3A32] hover:text-[#F9F5EF] transition-colors"
                >
                  Start Learning →
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 6 — The Mind Stylist Hypnosis Method™ */}
      <section className="py-24 bg-gradient-to-br from-[#6E4F7D] to-[#1E3A32]">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Sparkles size={40} className="text-[#D8B46B] mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl text-[#F9F5EF] mb-8">
              The Mind Stylist Hypnosis Method™
            </h2>

            <p className="text-[#F9F5EF]/90 text-lg mb-8 max-w-3xl mx-auto">
              Roberta's method blends:
            </p>

            <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
              {[
                "Hypnosis",
                "Emotional repatterning",
                "Internal narrative reframing",
                "Mind Styling Studio™ tools",
                "Pocket Visualization™ techniques"
              ].map((method, idx) => (
                <div key={idx} className="bg-white/10 backdrop-blur-sm p-4">
                  <p className="text-[#F9F5EF]">{method}</p>
                </div>
              ))}
            </div>

            <p className="text-[#F9F5EF]/90 text-lg mb-6">This creates a practitioner who is:</p>

            <div className="flex flex-wrap justify-center gap-4 mb-10">
              {["steady", "intuitive", "ethical", "calming", "adaptable", "client-centered"].map((trait, idx) => (
                <span
                  key={idx}
                  className="px-6 py-2 bg-[#D8B46B] text-[#1E3A32] text-sm tracking-wide"
                >
                  {trait}
                </span>
              ))}
            </div>

            <div className="bg-white/10 backdrop-blur-sm p-8 max-w-3xl mx-auto">
              <p className="font-serif text-2xl text-[#F9F5EF] italic mb-4">
                This is not hypnosis as performance.
              </p>
              <p className="font-serif text-2xl text-[#D8B46B] italic">
                It's hypnosis as transformation.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 7 — Enrollment & Pricing */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-8">
              Enrollment & Pricing
            </h2>

            <div className="bg-[#F9F5EF] p-10 mb-10">
              <p className="text-[#2B2725]/80 text-lg mb-4">
                Certification Track: <span className="font-medium text-[#1E3A32]">TBD</span>
              </p>
              <p className="text-[#2B2725]/80 text-lg">
                Audit Track: <span className="font-medium text-[#1E3A32]">TBD</span>
              </p>
            </div>

            <Link
              to={createPageUrl("Contact")}
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
            >
              Join the Waitlist
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Section 8 — FAQ */}
      <section className="py-24 bg-[#F9F5EF]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-12">
              <MessageCircle size={40} className="text-[#D8B46B] mx-auto mb-4" />
              <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-6">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-8">
              {[
                {
                  q: "Do I need prior experience?",
                  a: "No. This course is designed for beginners and seasoned practitioners."
                },
                {
                  q: "Will I be able to practice professionally after this training?",
                  a: "Yes — the Certification Track includes the necessary foundations to begin working with clients."
                },
                {
                  q: "Is hypnosis safe?",
                  a: "Absolutely. Roberta teaches ethical, responsible hypnosis grounded in emotional intelligence."
                },
                {
                  q: "Do I get ongoing support?",
                  a: "Yes — depending on your track, support is offered through Q&A, Office Hours, and community elements."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white p-8 border-l-4 border-[#D8B46B]">
                  <h3 className="font-serif text-xl text-[#1E3A32] mb-3">{faq.q}</h3>
                  <p className="text-[#2B2725]/80 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 9 — Final CTA */}
      <section className="py-24 bg-[#1E3A32]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-[#F9F5EF] leading-tight mb-6">
              Ready to Learn Hypnosis the Mind Stylist™ Way?
            </h2>
            <p className="text-[#F9F5EF]/80 text-lg mb-10 max-w-2xl mx-auto">
              Become a guide for change in your life—and in the lives of others.
            </p>
            <Link
              to="/app/login"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#F9F5EF] transition-all duration-300"
            >
              Start Your Training
              <ArrowRight size={18} />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}