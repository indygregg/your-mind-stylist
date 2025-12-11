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
    tagline: "The Complete Inner Transformation",
    description: "The flagship program. Edit → Tailor → Design your mental operating system.",
    features: [
      "Three structured phases: Edit, Tailor, Design",
      "30+ video lessons + guided practice",
      "Inner pattern assessments & diagnostics",
      "Emotional intelligence frameworks",
      "Future-self rehearsal methods",
      "Workbooks, prompts & integration tools",
      "Lifetime access to all content + updates",
      "Official certification upon completion"
    ],
    fullPayPrice: "$1,995",
    paymentPlans: [
      { label: "Full Pay", price: "$1,995", perMonth: null, note: "Pay once, lifetime access" },
      { label: "3-Month Plan", price: "$697", perMonth: "/mo", note: "3 payments of $697 ($2,091 total)" },
      { label: "6-Month Plan", price: "$365", perMonth: "/mo", note: "6 payments of $365 ($2,190 total)" }
    ],
    cta: "Enroll Now",
    link: isAuthenticated ? "/app/purchase/cert" : "/app/signup?redirect=/app/purchase/cert",
    color: "#1E3A32",
    isHero: true
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
              Restyle Your Mind,<br />Transform Your Life
            </h1>
            <p className="text-[#2B2725]/80 text-lg leading-relaxed max-w-3xl mx-auto">
              From comprehensive certification to daily mind resets — choose the path that meets you where you are.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Hero Product - Certification */}
      <section className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-[#1E3A32] to-[#2B2725] text-[#F9F5EF] p-10 md:p-12"
          >
            <div className="flex items-start gap-4 mb-6">
              <div className="w-16 h-16 bg-[#D8B46B]/20 rounded-full flex items-center justify-center flex-shrink-0">
                <Layers size={32} className="text-[#D8B46B]" />
              </div>
              <div>
                <h2 className="font-serif text-3xl md:text-4xl mb-2">{certification.title}</h2>
                <p className="text-[#F9F5EF]/70 text-sm uppercase tracking-wide">{certification.tagline}</p>
              </div>
            </div>

            <p className="text-[#F9F5EF]/90 text-lg mb-8 leading-relaxed">
              {certification.description}
            </p>

            {/* Features Grid */}
            <div className="grid md:grid-cols-2 gap-4 mb-10">
              {certification.features.map((feature) => (
                <div key={feature} className="flex items-start gap-3">
                  <Check size={18} className="text-[#D8B46B] mt-0.5 flex-shrink-0" />
                  <span className="text-[#F9F5EF]/90 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* Payment Options */}
            <div className="border-t border-[#F9F5EF]/20 pt-8">
              <h3 className="font-serif text-2xl mb-6">Choose Your Payment Plan</h3>
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                {certification.paymentPlans.map((plan, idx) => (
                  <div 
                    key={plan.label} 
                    className={`bg-[#F9F5EF]/10 backdrop-blur-sm p-6 transition-all duration-300 ${idx === 0 ? 'border-2 border-[#D8B46B]' : idx === 1 ? 'border-2 border-[#6E4F7D] hover:border-[#6E4F7D]' : 'border border-[#F9F5EF]/20 hover:border-[#D8B46B]/50 hover:bg-[#F9F5EF]/15'}`}
                  >
                    {idx === 0 && (
                      <span className="inline-block bg-[#D8B46B] text-[#1E3A32] text-xs px-3 py-1 mb-3 uppercase tracking-wide">
                        Best Value
                      </span>
                    )}
                    {idx === 1 && (
                      <span className="inline-block bg-[#6E4F7D] text-[#F9F5EF] text-xs px-3 py-1 mb-3 uppercase tracking-wide">
                        Most Popular
                      </span>
                    )}
                    <h4 className="font-medium text-lg mb-2">{plan.label}</h4>
                    <div className="mb-2">
                      <span className="font-serif text-3xl">{plan.price}</span>
                      {plan.perMonth && <span className="text-lg">{plan.perMonth}</span>}
                    </div>
                    <p className="text-[#F9F5EF]/60 text-xs">{plan.note}</p>
                  </div>
                ))}
              </div>

              <Link
                to={certification.link}
                className="group inline-flex items-center gap-3 px-8 py-4 bg-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#F9F5EF] transition-all duration-300"
              >
                {certification.cta}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Other Products Grid */}
      <section className="py-24 bg-[#F9F5EF]">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] text-center mb-12">
            More Ways to Work With Me
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[innerRehearsal, privateSessions, masterclass].map((product, index) => (
              <motion.div
                key={product.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-8 flex flex-col h-full"
              >
                <div 
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                  style={{ backgroundColor: `${product.color}15` }}
                >
                  <product.icon size={28} style={{ color: product.color }} />
                </div>

                <h3 className="font-serif text-2xl text-[#1E3A32] mb-2">
                  {product.title}
                </h3>
                <p className="text-[#2B2725]/60 text-xs uppercase tracking-wide mb-4">
                  {product.tagline}
                </p>
                <p className="text-[#2B2725]/80 text-sm mb-6">
                  {product.description}
                </p>

                <div className="mb-6 space-y-2 flex-grow">
                  {product.features.map((feature) => (
                    <div key={feature} className="flex items-start gap-2">
                      <Check size={16} className="text-[#D8B46B] mt-0.5 flex-shrink-0" />
                      <span className="text-[#2B2725]/80 text-xs">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="mb-6 pb-6 border-b border-[#E4D9C4]">
                  {product.priceMonthly ? (
                    <div>
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-serif text-2xl text-[#1E3A32]">{product.priceMonthly}</span>
                        <span className="text-[#2B2725]/60 text-sm">or</span>
                        <span className="font-serif text-2xl text-[#1E3A32]">{product.priceYearly}</span>
                      </div>
                      <p className="text-[#D8B46B] text-xs">{product.savings}</p>
                    </div>
                  ) : (
                    <div>
                      <div className="font-serif text-3xl text-[#1E3A32] mb-1">
                        {product.price}
                      </div>
                      {product.priceNote && (
                        <p className="text-[#2B2725]/60 text-xs">{product.priceNote}</p>
                      )}
                    </div>
                  )}
                </div>

                <Link
                  to={product.link}
                  className="group w-full px-6 py-3 bg-[#1E3A32] text-[#F9F5EF] text-center text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {product.cta}
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-serif text-3xl md:text-4xl text-[#1E3A32] text-center mb-12">
              Common Questions
            </h2>
            <div className="space-y-8">
              <div>
                <h3 className="font-medium text-[#1E3A32] text-lg mb-3">
                  What's the difference between the Certification and Private Sessions?
                </h3>
                <p className="text-[#2B2725]/80 leading-relaxed">
                  The Certification is a self-paced structured program with lessons, tools, and assessments designed for broad transformation. Private Sessions are one-on-one custom work tailored to your unique patterns. Many clients do both — the Certification provides the framework, and Private Sessions offer personalized guidance.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-[#1E3A32] text-lg mb-3">
                  Can I do a payment plan for the Certification?
                </h3>
                <p className="text-[#2B2725]/80 leading-relaxed">
                  Yes. You can choose full pay ($1,995), a 3-month plan (3 × $697), or a 6-month plan (6 × $365). Payment plans allow you to start immediately while spreading the investment.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-[#1E3A32] text-lg mb-3">
                  What if I'm not ready for the full Certification yet?
                </h3>
                <p className="text-[#2B2725]/80 leading-relaxed">
                  Start with the free masterclass or explore the Inner Rehearsal Sessions. Both are gentle entry points that introduce the Mind Styling approach without requiring a major commitment.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-[#1E3A32] text-lg mb-3">
                  Is there a refund policy?
                </h3>
                <p className="text-[#2B2725]/80 leading-relaxed">
                  The Certification and Inner Rehearsal come with a 14-day money-back guarantee. If within the first two weeks you feel it's not the right fit, reach out and we'll process a full refund.
                </p>
              </div>
            </div>
          </motion.div>
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
              Still Not Sure Where to Start?
            </h2>
            <p className="text-[#2B2725]/80 text-lg mb-8">
              No pressure. Start with the free masterclass, or reach out for a consultation. I'll help you find the right path.
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