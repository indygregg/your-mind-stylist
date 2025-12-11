import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import SEO from "../components/SEO";
import { 
  Sparkles, 
  Users, 
  Crown, 
  ArrowRight,
  BookOpen,
  Zap,
  Heart,
  CheckCircle
} from "lucide-react";

export default function Programs() {
  return (
    <div className="bg-[#F9F5EF]">
      <SEO
        title="Programs & Pricing | Your Mind Stylist"
        description="Find your next step with Your Mind Stylist programs — from introductory tools to deep transformation coaching. Clear pricing, clear pathways."
        canonical="/programs"
      />

      {/* Hero Section */}
      <section className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
              Programs & Pricing
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
              Your Mind Stylist Programs
            </h1>
            <p className="text-[#2B2725]/80 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto">
              Find your next step, whether you're just beginning or ready for deep transformation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 1 — Intro / Value Proposition */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <Sparkles size={40} className="text-[#D8B46B] mx-auto mb-6" />
            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-6 max-w-3xl mx-auto">
              <strong className="text-[#1E3A32]">Your Mind Stylist offers transformational pathways for every phase of your inner journey.</strong>
            </p>
            <p className="text-[#2B2725]/80 text-lg leading-relaxed max-w-3xl mx-auto">
              From introductory tools that help you clear mental clutter to high-touch coaching that reshapes your emotional operating system — choose what aligns with you today.
            </p>
            <p className="text-[#1E3A32] font-serif text-xl italic mt-8">
              Every program below is designed to help you understand yourself better, shift patterns with awareness, and build emotional resilience that lasts.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Section 2 — Choose Your Path */}
      <section className="py-20 bg-[#F9F5EF]">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] text-center mb-16">
              Choose Your Path
            </h2>

            {/* Tier 1 — Foundations & Everyday Support */}
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <Zap size={28} className="text-[#D8B46B]" />
                <h3 className="font-serif text-2xl md:text-3xl text-[#1E3A32]">
                  Tier 1 — Foundations & Everyday Support
                </h3>
              </div>
              <p className="text-[#2B2725]/70 mb-8">Entry-level offerings (low commitment, high accessibility)</p>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Mind Declutter Audio Series */}
                <div className="bg-white p-8 border border-[#E4D9C4] hover:border-[#D8B46B] transition-all">
                  <h4 className="font-serif text-xl text-[#1E3A32] mb-3">Mind Declutter Audio Series</h4>
                  <p className="text-[#2B2725]/70 text-sm mb-4">
                    Introductory self-paced audio sessions for emotional reset and focus
                  </p>
                  <p className="text-2xl font-bold text-[#1E3A32] mb-6">$9–$19</p>
                  <Link to={createPageUrl("PurchaseCenter")}>
                    <Button className="w-full bg-[#1E3A32] hover:bg-[#2B2725]">
                      Browse Series
                    </Button>
                  </Link>
                </div>

                {/* Pocket Visualization */}
                <div className="bg-white p-8 border-2 border-[#D8B46B] relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D8B46B] px-4 py-1 text-xs text-[#1E3A32] tracking-wide uppercase">
                    Popular
                  </div>
                  <h4 className="font-serif text-xl text-[#1E3A32] mb-3">Pocket Visualization™</h4>
                  <p className="text-[#2B2725]/70 text-sm mb-4">
                    Daily emotional state guidance (Roberta in your pocket)
                  </p>
                  <p className="text-2xl font-bold text-[#1E3A32] mb-2">$7/mo</p>
                  <p className="text-sm text-[#2B2725]/60 mb-6">or $70/year</p>
                  <Link to={createPageUrl("InnerRehearsal")}>
                    <Button className="w-full bg-[#D8B46B] text-[#1E3A32] hover:bg-[#1E3A32] hover:text-[#F9F5EF]">
                      Start for $7/mo
                    </Button>
                  </Link>
                </div>

                {/* Mini-Series Webinars */}
                <div className="bg-white p-8 border border-[#E4D9C4] hover:border-[#D8B46B] transition-all">
                  <h4 className="font-serif text-xl text-[#1E3A32] mb-3">Mind Styling Mini-Series™ Webinars</h4>
                  <p className="text-[#2B2725]/70 text-sm mb-4">
                    Short lessons on specific psychological themes
                  </p>
                  <p className="text-2xl font-bold text-[#1E3A32] mb-6">$9 each</p>
                  <Link to={createPageUrl("PurchaseCenter")}>
                    <Button className="w-full bg-[#1E3A32] hover:bg-[#2B2725]">
                      Browse Webinars
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Tier 2 — Mid-Level Learning */}
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <BookOpen size={28} className="text-[#6E4F7D]" />
                <h3 className="font-serif text-2xl md:text-3xl text-[#1E3A32]">
                  Tier 2 — Mid-Level Learning
                </h3>
              </div>
              <p className="text-[#2B2725]/70 mb-8">More structured, self-paced learning designed for deeper change</p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* 5-Part Toolkit Series */}
                <div className="bg-white p-8 border border-[#E4D9C4]">
                  <h4 className="font-serif text-xl text-[#1E3A32] mb-3">5-Part Toolkit Series</h4>
                  <p className="text-[#2B2725]/70 text-sm mb-4">
                    Core modules teaching foundational Mind Styling principles
                  </p>
                  <p className="text-2xl font-bold text-[#1E3A32] mb-6">$189 per module</p>
                  <Link to={createPageUrl("PurchaseCenter")}>
                    <Button className="w-full bg-[#1E3A32] hover:bg-[#2B2725]">
                      Browse Modules
                    </Button>
                  </Link>
                </div>

                {/* Toolkit Full Bundle */}
                <div className="bg-[#6E4F7D] text-white p-8 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D8B46B] px-4 py-1 text-xs text-[#1E3A32] tracking-wide uppercase">
                    Best Value
                  </div>
                  <h4 className="font-serif text-xl mb-3">Toolkit Full Bundle</h4>
                  <p className="text-white/90 text-sm mb-4">
                    All 5 modules in one package
                  </p>
                  <p className="text-3xl font-bold mb-6">$719</p>
                  <Link to={createPageUrl("PurchaseCenter")}>
                    <Button className="w-full bg-[#D8B46B] text-[#1E3A32] hover:bg-white">
                      Get Full Toolkit
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Tier 3 — High-Touch Coaching & Community */}
            <div className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <Users size={28} className="text-[#A6B7A3]" />
                <h3 className="font-serif text-2xl md:text-3xl text-[#1E3A32]">
                  Tier 3 — High-Touch Coaching & Community
                </h3>
              </div>
              <p className="text-[#2B2725]/70 mb-8">Work with Roberta more directly — small group or 1:1 support</p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Salon (Group Coaching) */}
                <div className="bg-white p-8 border border-[#E4D9C4]">
                  <div className="flex items-center gap-2 mb-4">
                    <Users size={24} className="text-[#A6B7A3]" />
                    <h4 className="font-serif text-xl text-[#1E3A32]">Salon (Group Coaching)</h4>
                  </div>
                  <p className="text-[#2B2725]/70 text-sm mb-4">
                    12 participants, monthly live sessions plus toolkit guidance
                  </p>
                  <p className="text-3xl font-bold text-[#1E3A32] mb-6">$1,995</p>
                  <Link to={createPageUrl("PurchaseCenter")}>
                    <Button className="w-full bg-[#1E3A32] hover:bg-[#2B2725]">
                      Book Salon Coaching
                    </Button>
                  </Link>
                </div>

                {/* Couture (1:1 Premium Coaching) */}
                <div className="bg-gradient-to-br from-[#1E3A32] to-[#2B2725] text-white p-8 relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D8B46B] px-4 py-1 text-xs text-[#1E3A32] tracking-wide uppercase">
                    Premium
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                    <Crown size={24} className="text-[#D8B46B]" />
                    <h4 className="font-serif text-xl">Couture (1:1 Premium Coaching)</h4>
                  </div>
                  <p className="text-white/90 text-sm mb-4">
                    Intensive personal coaching + journal + bespoke hypnosis
                  </p>
                  <p className="text-3xl font-bold mb-6">$7,995</p>
                  <Link to={createPageUrl("PrivateSessions")}>
                    <Button className="w-full bg-[#D8B46B] text-[#1E3A32] hover:bg-white">
                      Begin Couture Coaching
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Advanced Opportunities */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Crown size={28} className="text-[#D8B46B]" />
                <h3 className="font-serif text-2xl md:text-3xl text-[#1E3A32]">
                  Advanced Opportunities
                </h3>
              </div>
              <p className="text-[#2B2725]/70 mb-8">Build mastery and expand your transformational reach</p>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Hypnosis Training — Certification */}
                <div className="bg-white p-8 border border-[#E4D9C4]">
                  <h4 className="font-serif text-xl text-[#1E3A32] mb-3">
                    Hypnosis Training — Certification Track
                  </h4>
                  <p className="text-[#2B2725]/70 text-sm mb-4">
                    Full training for professional practice
                  </p>
                  <p className="text-xl font-medium text-[#2B2725]/60 mb-6">TBD</p>
                  <Link to={createPageUrl("LearnHypnosis")}>
                    <Button variant="outline" className="w-full border-[#1E3A32] text-[#1E3A32] hover:bg-[#1E3A32] hover:text-white">
                      Join Waitlist
                    </Button>
                  </Link>
                </div>

                {/* Hypnosis Training — Audit */}
                <div className="bg-white p-8 border border-[#E4D9C4]">
                  <h4 className="font-serif text-xl text-[#1E3A32] mb-3">
                    Hypnosis Training — Audit Track
                  </h4>
                  <p className="text-[#2B2725]/70 text-sm mb-4">
                    Self-paced learning without certification
                  </p>
                  <p className="text-xl font-medium text-[#2B2725]/60 mb-6">TBD</p>
                  <Link to={createPageUrl("LearnHypnosis")}>
                    <Button variant="outline" className="w-full border-[#1E3A32] text-[#1E3A32] hover:bg-[#1E3A32] hover:text-white">
                      Join Waitlist
                    </Button>
                  </Link>
                </div>

                {/* Annual Retreat */}
                <div className="bg-white p-8 border border-[#E4D9C4]">
                  <h4 className="font-serif text-xl text-[#1E3A32] mb-3">
                    Annual Retreat ("The Lab")
                  </h4>
                  <p className="text-[#2B2725]/70 text-sm mb-4">
                    One-day immersion experience <em>(coming soon)</em>
                  </p>
                  <p className="text-xl font-medium text-[#2B2725]/60 mb-6">Coming Soon</p>
                  <Link to={createPageUrl("Contact")}>
                    <Button variant="outline" className="w-full border-[#1E3A32] text-[#1E3A32] hover:bg-[#1E3A32] hover:text-white">
                      Express Interest
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 3 — How to Choose */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Heart size={40} className="text-[#D8B46B] mx-auto mb-6" />
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] text-center mb-12">
              How to Choose What's Right
            </h2>

            <p className="text-[#2B2725]/80 text-lg text-center mb-10">Not sure what to start with?</p>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-[#F9F5EF] p-6 border-l-4 border-[#D8B46B]">
                <p className="text-[#2B2725]/80 mb-2">New to this world?</p>
                <p className="font-serif text-xl text-[#1E3A32]">Pocket Visualization™ is the perfect gentle entry.</p>
              </div>

              <div className="bg-[#F9F5EF] p-6 border-l-4 border-[#6E4F7D]">
                <p className="text-[#2B2725]/80 mb-2">Want structured learning with tangible skills?</p>
                <p className="font-serif text-xl text-[#1E3A32]">Toolkit Series is your foundation.</p>
              </div>

              <div className="bg-[#F9F5EF] p-6 border-l-4 border-[#A6B7A3]">
                <p className="text-[#2B2725]/80 mb-2">You want community + live support?</p>
                <p className="font-serif text-xl text-[#1E3A32]">Salon Group Coaching delivers that.</p>
              </div>

              <div className="bg-[#F9F5EF] p-6 border-l-4 border-[#1E3A32]">
                <p className="text-[#2B2725]/80 mb-2">You want the deepest transformation?</p>
                <p className="font-serif text-xl text-[#1E3A32]">Couture Coaching is for you.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 4 — Pricing Philosophy */}
      <section className="py-20 bg-[#F9F5EF]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-8">
              Pricing Philosophy & Support
            </h2>

            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-8">
              At Your Mind Stylist, we price for:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-10 max-w-2xl mx-auto">
              {[
                "Ethical accessibility",
                "Transformational depth",
                "Clarity, not hidden fees",
                "Value that grows with you"
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-white p-4">
                  <CheckCircle size={18} className="text-[#A6B7A3] flex-shrink-0" />
                  <p className="text-[#2B2725]">{item}</p>
                </div>
              ))}
            </div>

            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-6">
              We also offer:
            </p>

            <div className="space-y-3 max-w-2xl mx-auto">
              {[
                "Payment plan options where appropriate",
                "Email support to help you choose",
                "A clear refund policy (see Terms)"
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3 bg-white p-4">
                  <CheckCircle size={18} className="text-[#D8B46B] flex-shrink-0 mt-1" />
                  <p className="text-[#2B2725]/80">{item}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Section 5 — CTA Grid */}
      <section className="py-20 bg-[#1E3A32]">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#F9F5EF] text-center mb-12">
              Ready to Begin?
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              <Link to={createPageUrl("InnerRehearsal")}>
                <Button className="w-full h-full bg-[#D8B46B] text-[#1E3A32] hover:bg-[#F9F5EF] py-6 flex flex-col items-center justify-center gap-2">
                  <span className="text-sm font-normal">Pocket Visualization™</span>
                  <span className="text-lg font-bold">Start for $7/mo</span>
                </Button>
              </Link>

              <Link to={createPageUrl("PurchaseCenter")}>
                <Button className="w-full h-full bg-white text-[#1E3A32] hover:bg-[#F9F5EF] py-6 flex flex-col items-center justify-center gap-2">
                  <span className="text-sm font-normal">Mini Webinars</span>
                  <span className="text-lg font-bold">Explore Now</span>
                </Button>
              </Link>

              <Link to={createPageUrl("PurchaseCenter")}>
                <Button className="w-full h-full bg-[#6E4F7D] text-white hover:bg-[#5A3F67] py-6 flex flex-col items-center justify-center gap-2">
                  <span className="text-sm font-normal">Toolkit Full Bundle</span>
                  <span className="text-lg font-bold">$719</span>
                </Button>
              </Link>

              <Link to={createPageUrl("PurchaseCenter")}>
                <Button className="w-full h-full bg-white text-[#1E3A32] hover:bg-[#F9F5EF] py-6 flex flex-col items-center justify-center gap-2">
                  <span className="text-sm font-normal">Salon Coaching</span>
                  <span className="text-lg font-bold">$1,995</span>
                </Button>
              </Link>

              <Link to={createPageUrl("PrivateSessions")}>
                <Button className="w-full h-full bg-[#D8B46B] text-[#1E3A32] hover:bg-[#F9F5EF] py-6 flex flex-col items-center justify-center gap-2">
                  <span className="text-sm font-normal">Couture Coaching</span>
                  <span className="text-lg font-bold">$7,995</span>
                </Button>
              </Link>

              <Link to={createPageUrl("LearnHypnosis")}>
                <Button className="w-full h-full bg-white text-[#1E3A32] hover:bg-[#F9F5EF] py-6 flex flex-col items-center justify-center gap-2">
                  <span className="text-sm font-normal">Hypnosis Training</span>
                  <span className="text-lg font-bold">Join Waitlist</span>
                </Button>
              </Link>
            </div>

            <div className="text-center mt-12">
              <p className="text-[#F9F5EF]/70 mb-4">Still have questions?</p>
              <Link to={createPageUrl("Contact")}>
                <Button variant="outline" className="border-[#D8B46B] text-[#D8B46B] hover:bg-[#D8B46B] hover:text-[#1E3A32]">
                  Contact Us
                  <ArrowRight size={18} className="ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}