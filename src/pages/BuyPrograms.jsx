import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Sparkles, 
  Users, 
  Crown, 
  ArrowRight,
  BookOpen,
  Zap,
  Heart,
  CheckCircle,
  ShoppingCart
} from "lucide-react";

export default function BuyPrograms() {
  return (
    <div className="bg-[#F9F5EF] min-h-screen py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <ShoppingCart size={48} className="text-[#D8B46B] mx-auto mb-6" />
          <h1 className="font-serif text-4xl md:text-5xl text-[#1E3A32] leading-tight mb-4">
            Upgrade Your Journey
          </h1>
          <p className="text-[#2B2725]/80 text-xl leading-relaxed max-w-3xl mx-auto">
            Choose your next step in transformation. Every program is designed to help you understand yourself better and build lasting emotional resilience.
          </p>
        </motion.div>

        {/* Tier 1 — Foundations & Everyday Support */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Zap size={28} className="text-[#D8B46B]" />
            <h2 className="font-serif text-2xl md:text-3xl text-[#1E3A32]">
              Foundations & Everyday Support
            </h2>
          </div>
          <p className="text-[#2B2725]/70 mb-8">Entry-level offerings for daily guidance and emotional reset</p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Mind Declutter Audio Series */}
            <div className="bg-white p-8 border border-[#E4D9C4] hover:border-[#D8B46B] transition-all rounded-lg">
              <h3 className="font-serif text-xl text-[#1E3A32] mb-3">Mind Declutter Audio Series</h3>
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
            <div className="bg-white p-8 border-2 border-[#D8B46B] relative rounded-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D8B46B] px-4 py-1 text-xs text-[#1E3A32] tracking-wide uppercase">
                Most Popular
              </div>
              <h3 className="font-serif text-xl text-[#1E3A32] mb-3">Pocket Visualization™</h3>
              <p className="text-[#2B2725]/70 text-sm mb-4">
                Daily emotional state guidance (Roberta in your pocket)
              </p>
              <p className="text-2xl font-bold text-[#1E3A32] mb-2">$7/mo</p>
              <p className="text-sm text-[#2B2725]/60 mb-6">or $70/year</p>
              <Link to={createPageUrl("PocketVisualization")}>
                <Button className="w-full bg-[#D8B46B] text-[#1E3A32] hover:bg-[#1E3A32] hover:text-[#F9F5EF]">
                  Start for $7/mo
                </Button>
              </Link>
            </div>

            {/* Mini-Series Webinars */}
            <div className="bg-white p-8 border border-[#E4D9C4] hover:border-[#D8B46B] transition-all rounded-lg">
              <h3 className="font-serif text-xl text-[#1E3A32] mb-3">Mind Styling Mini-Series™ Webinars</h3>
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
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen size={28} className="text-[#6E4F7D]" />
            <h2 className="font-serif text-2xl md:text-3xl text-[#1E3A32]">
              Mid-Level Learning
            </h2>
          </div>
          <p className="text-[#2B2725]/70 mb-8">Structured, self-paced learning designed for deeper change</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* 5-Part Toolkit Series */}
            <div className="bg-white p-8 border border-[#E4D9C4] rounded-lg">
              <h3 className="font-serif text-xl text-[#1E3A32] mb-3">5-Part Toolkit Series</h3>
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
            <div className="bg-[#6E4F7D] text-white p-8 relative rounded-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D8B46B] px-4 py-1 text-xs text-[#1E3A32] tracking-wide uppercase">
                Best Value
              </div>
              <h3 className="font-serif text-xl mb-3">Toolkit Full Bundle</h3>
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
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Users size={28} className="text-[#A6B7A3]" />
            <h2 className="font-serif text-2xl md:text-3xl text-[#1E3A32]">
              High-Touch Coaching & Community
            </h2>
          </div>
          <p className="text-[#2B2725]/70 mb-8">Work with Roberta more directly — small group or 1:1 support</p>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Salon (Group Coaching) */}
            <div className="bg-white p-8 border border-[#E4D9C4] rounded-lg">
              <div className="flex items-center gap-2 mb-4">
                <Users size={24} className="text-[#A6B7A3]" />
                <h3 className="font-serif text-xl text-[#1E3A32]">Salon (Group Coaching)</h3>
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
            <div className="bg-gradient-to-br from-[#1E3A32] to-[#2B2725] text-white p-8 relative rounded-lg">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D8B46B] px-4 py-1 text-xs text-[#1E3A32] tracking-wide uppercase">
                Premium
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Crown size={24} className="text-[#D8B46B]" />
                <h3 className="font-serif text-xl">Couture (1:1 Premium Coaching)</h3>
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
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <Crown size={28} className="text-[#D8B46B]" />
            <h2 className="font-serif text-2xl md:text-3xl text-[#1E3A32]">
              Advanced Opportunities
            </h2>
          </div>
          <p className="text-[#2B2725]/70 mb-8">Build mastery and expand your transformational reach</p>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Hypnosis Training — Certification */}
            <div className="bg-white p-8 border border-[#E4D9C4] rounded-lg">
              <h3 className="font-serif text-xl text-[#1E3A32] mb-3">
                Hypnosis Training — Certification
              </h3>
              <p className="text-[#2B2725]/70 text-sm mb-4">
                Full training for professional practice
              </p>
              <p className="text-xl font-medium text-[#2B2725]/60 mb-6">Coming Soon</p>
              <Link to={createPageUrl("LearnHypnosis")}>
                <Button variant="outline" className="w-full border-[#1E3A32] text-[#1E3A32] hover:bg-[#1E3A32] hover:text-white">
                  Join Waitlist
                </Button>
              </Link>
            </div>

            {/* Hypnosis Training — Audit */}
            <div className="bg-white p-8 border border-[#E4D9C4] rounded-lg">
              <h3 className="font-serif text-xl text-[#1E3A32] mb-3">
                Hypnosis Training — Audit Track
              </h3>
              <p className="text-[#2B2725]/70 text-sm mb-4">
                Self-paced learning without certification
              </p>
              <p className="text-xl font-medium text-[#2B2725]/60 mb-6">Coming Soon</p>
              <Link to={createPageUrl("LearnHypnosis")}>
                <Button variant="outline" className="w-full border-[#1E3A32] text-[#1E3A32] hover:bg-[#1E3A32] hover:text-white">
                  Join Waitlist
                </Button>
              </Link>
            </div>

            {/* Annual Retreat */}
            <div className="bg-white p-8 border border-[#E4D9C4] rounded-lg">
              <h3 className="font-serif text-xl text-[#1E3A32] mb-3">
                Annual Retreat ("The Lab")
              </h3>
              <p className="text-[#2B2725]/70 text-sm mb-4">
                One-day immersion experience
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

        {/* How to Choose */}
        <div className="bg-white p-8 rounded-lg mb-16">
          <Heart size={40} className="text-[#D8B46B] mx-auto mb-6" />
          <h2 className="font-serif text-3xl text-[#1E3A32] text-center mb-8">
            How to Choose What's Right
          </h2>

          <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
            <div className="bg-[#F9F5EF] p-6 border-l-4 border-[#D8B46B] rounded">
              <p className="text-[#2B2725]/80 mb-2 text-sm">New to this world?</p>
              <p className="font-serif text-lg text-[#1E3A32]">Pocket Visualization™ is the perfect gentle entry.</p>
            </div>

            <div className="bg-[#F9F5EF] p-6 border-l-4 border-[#6E4F7D] rounded">
              <p className="text-[#2B2725]/80 mb-2 text-sm">Want structured learning?</p>
              <p className="font-serif text-lg text-[#1E3A32]">Toolkit Series is your foundation.</p>
            </div>

            <div className="bg-[#F9F5EF] p-6 border-l-4 border-[#A6B7A3] rounded">
              <p className="text-[#2B2725]/80 mb-2 text-sm">Want community + live support?</p>
              <p className="font-serif text-lg text-[#1E3A32]">Salon Group Coaching delivers that.</p>
            </div>

            <div className="bg-[#F9F5EF] p-6 border-l-4 border-[#1E3A32] rounded">
              <p className="text-[#2B2725]/80 mb-2 text-sm">Want the deepest transformation?</p>
              <p className="font-serif text-lg text-[#1E3A32]">Couture Coaching is for you.</p>
            </div>
          </div>
        </div>

        {/* Questions CTA */}
        <div className="text-center">
          <p className="text-[#2B2725]/70 mb-4 text-lg">
            Still have questions?
          </p>
          <Link to={createPageUrl("Contact")}>
            <Button variant="outline" className="border-[#D8B46B] text-[#D8B46B] hover:bg-[#D8B46B] hover:text-[#1E3A32]">
              Contact Us
              <ArrowRight size={18} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}