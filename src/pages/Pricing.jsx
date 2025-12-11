import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { ArrowRight, Check, Layers, Sparkles, User, Play, Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";

export default function Pricing() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authed = await base44.auth.isAuthenticated();
      setIsAuthenticated(authed);
    };
    checkAuth();
  }, []);

  const certification = {
    icon: Layers,
    title: "The Mind Styling Certification™",
    tagline: "A 3-Part Inner Redesign",
    description: "Edit → Tailor → Design your mental operating system",
    features: [
      "Three structured phases of transformation",
      "Video lessons + guided practice",
      "Inner pattern assessments",
      "Emotional intelligence tools",
      "Future-self rehearsal methods",
      "Workbooks & prompts",
      "Lifetime access to all content",
      "Certification upon completion"
    ],
    price: "$1,995",
    paymentPlan: "Payment plans available",
    cta: "Get Started",
    link: isAuthenticated ? "/app/purchase" : "/app/signup?redirect=/app/purchase",
    color: "#1E3A32"
  };

  const innerRehearsal = {
    icon: Sparkles,
    title: "Inner Rehearsal Sessions™",
    tagline: "Calm, Clarity & Identity Shifts",
    description: "Short, powerful guided audio sessions to reset your mind in minutes",
    features: [
      "Library of guided sessions",
      "Calm & Nervous System Resets",
      "Confidence & Identity Expansion",
      "Performance Prep & Recovery",
      "New sessions added monthly",
      "Stream or download",
      "Cancel anytime"
    ],
    priceMonthly: "$29/mo",
    priceYearly: "$299/yr",
    savings: "Save $49 with annual",
    cta: "Join Now",
    link: isAuthenticated ? "/app/purchase" : "/app/signup?redirect=/app/purchase",
    color: "#A6B7A3"
  };

  const privateSessions = {
    icon: User,
    title: "Private Mind Styling",
    tagline: "1:1 Work with Roberta",
    description: "Deep, custom guidance for personal transformation",
    features: [
      "One-on-one sessions with Roberta",
      "Custom pattern identification",
      "Tailored Mind Styling tools",
      "Emotional intelligence training",
      "Identity & confidence work",
      "Personalized integration plan"
    ],
    price: "$250",
    priceNote: "per consultation",
    cta: "Request Session",
    link: createPageUrl("Contact?type=private"),
    color: "#6E4F7D"
  };

  const masterclass = {
    icon: Play,
    title: "Imposter Syndrome & Other Myths to Ditch",
    tagline: "Free On-Demand Masterclass",
    description: "Understand the roots of self-doubt and how to move past it",
    features: [
      "Watch anytime, anywhere",
      "No credit card required",
      "Instant access",
      "Perfect starting point"
    ],
    price: "Free",
    cta: "Start Free",
    link: isAuthenticated ? createPageUrl("FreeMasterclass") : "/app/signup?redirect=/free-masterclass",
    color: "#D8B46B"
  };

  const products = [certification, innerRehearsal, privateSessions, masterclass];

  return (
    <div className="bg-[#F9F5EF]">
      <SEO
        title="Pricing | The Mind Stylist"
        description="Choose your path: The Mind Styling Certification™, Inner Rehearsal Sessions™, Private Mind Styling, or start with the free masterclass."
        canonical="/pricing"
      />

      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
              Pricing
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
              Choose Your Path
            </h1>
            <p className="text-[#2B2725]/80 text-lg leading-relaxed max-w-3xl mx-auto">
              Programs and tools to help you restyle your mind, your patterns, and your future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-[#F9F5EF] p-8 md:p-10 flex flex-col h-full"
              >
                {/* Icon */}
                <div 
                  className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${product.color}15` }}
                >
                  <product.icon size={32} style={{ color: product.color }} />
                </div>

                {/* Header */}
                <h2 className="font-serif text-2xl md:text-3xl text-[#1E3A32] mb-2">
                  {product.title}
                </h2>
                <p className="text-[#2B2725]/60 text-sm uppercase tracking-wide mb-4">
                  {product.tagline}
                </p>
                <p className="text-[#2B2725]/80 mb-6">
                  {product.description}
                </p>

                {/* Features */}
                <div className="mb-8 space-y-3 flex-grow">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-3">
                      <Check size={18} className="text-[#D8B46B] mt-0.5 flex-shrink-0" />
                      <span className="text-[#2B2725]/80 text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="mb-6 pb-6 border-b border-[#E4D9C4]">
                  {product.priceMonthly ? (
                    <div>
                      <div className="flex items-baseline gap-3 mb-2">
                        <span className="font-serif text-3xl text-[#1E3A32]">{product.priceMonthly}</span>
                        <span className="text-[#2B2725]/60">or</span>
                        <span className="font-serif text-3xl text-[#1E3A32]">{product.priceYearly}</span>
                      </div>
                      <p className="text-[#D8B46B] text-sm">{product.savings}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="font-serif text-4xl text-[#1E3A32] mb-1">
                        {product.price}
                      </div>
                      {product.priceNote && (
                        <p className="text-[#2B2725]/60 text-sm">{product.priceNote}</p>
                      )}
                      {product.paymentPlan && (
                        <p className="text-[#D8B46B] text-sm mt-2">{product.paymentPlan}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* CTA */}
                <Link
                  to={product.link}
                  className="group w-full px-6 py-4 bg-[#1E3A32] text-[#F9F5EF] text-center text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {product.cta}
                  <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Not Sure Section */}
      <section className="py-20 bg-[#F9F5EF]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-6">
              Not Sure Where to Start?
            </h2>
            <p className="text-[#2B2725]/80 text-lg mb-8">
              Start with the free masterclass, or reach out to schedule a consultation to discuss what path is right for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to={masterclass.link}
                className="px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
              >
                Watch Free Masterclass
              </Link>
              <Link
                to={createPageUrl("Contact")}
                className="px-8 py-4 border border-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#D8B46B]/10 transition-all duration-300"
              >
                Schedule a Consultation
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer CTA */}
      {!isAuthenticated && (
        <section className="py-12 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-[#2B2725]/70">
              Already have an account?{" "}
              <a href="/app/login" className="text-[#1E3A32] font-medium hover:text-[#D8B46B] transition-colors">
                Log in to view your purchase options
              </a>
            </p>
          </div>
        </section>
      )}
    </div>
  );
}