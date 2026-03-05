import React from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle, Heart, Sparkles, Users, Star } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import SEO from "../components/SEO";
import { Button } from "@/components/ui/button";

const SERVICES = [
  {
    key: "closet",
    name: "Cleaning Out Your Closet™",
    tagline: "One-on-one hypnosis work tailored to suit your needs",
    description: "Spend 10-12 hours with Roberta to clear your emotional closet of things that no longer fit. This transformational process edits outdated beliefs and unresolved emotions that keep you stuck, so you can Restyle your future.",
    details: ["10–12 hours of private sessions", "Fully customized to your needs", "Addresses beliefs, emotions & patterns", "Free consultation to see if it's the right fit"],
    color: "border-[#6E4F7D]",
    accentColor: "text-[#6E4F7D]",
    linkPage: "CleaningOutYourCloset",
  },
  {
    key: "lens",
    name: "LENS™ Mind Styling Framework",
    tagline: "Roberta's flagship framework for emotional intelligence",
    description: "The LENS™ framework guides you through Language, Emotions, Nervous System, and Style — a structured approach to understanding and reshaping how you think, feel, and respond.",
    details: ["Structured learning path", "Language & emotion re-patterning", "Nervous system regulation tools", "Builds lasting emotional resilience"],
    color: "border-[#1E3A32]",
    accentColor: "text-[#1E3A32]",
    linkPage: "LENS",
  },
  {
    key: "pocket-mindset",
    name: "Pocket Mindset™",
    tagline: "Daily guided experiences for ongoing transformation",
    description: "A guided audio-based daily practice that keeps you in the Mind Styling mindset. Perfect for anyone who wants consistent, accessible support between sessions or as a standalone daily tool.",
    details: ["Audio-based daily practice", "Accessible anytime, anywhere", "Great entry point into Mind Styling", "Pairs well with deeper programs"],
    color: "border-[#D8B46B]",
    accentColor: "text-[#D8B46B]",
    linkPage: "PocketMindset",
  },
  {
    key: "consultation",
    name: "Initial Consultation",
    tagline: "A free conversation to find your best path",
    description: "Not sure where to start? A free consultation with Roberta will help you find the right program, understand your goals, and determine your investment of time and energy.",
    details: ["Completely free", "No pressure or obligation", "Personalized program recommendation", "Complete intake form beforehand"],
    color: "border-[#A6B7A3]",
    accentColor: "text-[#A6B7A3]",
    linkPage: "Consultations",
  },
];

export default function SignatureServices() {
  const { data: products = [] } = useQuery({
    queryKey: ["signature-products"],
    queryFn: () =>
      base44.entities.Product.filter({ status: "published", active: true }, "display_order"),
  });

  // Signature services = non-course, non-bundle products
  const signatureProducts = products.filter(
    (p) =>
      p.ui_group !== "hidden" &&
      p.product_subtype !== "course" &&
      !p.is_bundle &&
      p.type !== "bundle"
  );

  return (
    <div className="bg-[#F9F5EF] min-h-screen">
      <SEO
        title="Signature Services | Your Mind Stylist"
        description="One-on-one hypnosis, coaching, and private sessions with Roberta Fernandez — Your Mind Stylist."
        canonical="/signature-services"
      />

      {/* Hero */}
      <section className="pt-32 pb-20 bg-[#6E4F7D]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-white/60 text-xs tracking-[0.3em] uppercase mb-4 block">
              Personal Work with Roberta
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-6">
              Signature Services
            </h1>
            <p className="text-white/80 text-xl max-w-2xl mx-auto mb-10">
              High-touch, one-on-one hypnosis and coaching experiences — tailored entirely to you.
            </p>
            <Link to={createPageUrl("Consultations")}>
              <Button className="bg-[#D8B46B] text-[#1E3A32] hover:bg-[#C5A35B] px-8 py-4 text-base font-semibold">
                Book a Free Consultation
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Intro */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Heart size={36} className="text-[#6E4F7D] mx-auto mb-6" />
          <p className="text-[#2B2725]/80 text-lg leading-relaxed">
            These services are Roberta's most personal offerings — designed for people who are ready to do real, deep work.
            Whether you're clearing long-held patterns, learning to regulate your emotions, or building a daily mindset practice,
            each service is crafted to meet you exactly where you are.
          </p>
        </div>
      </section>

      {/* Services from DB */}
      {signatureProducts.length > 0 && (
        <section className="py-16 bg-[#F9F5EF]">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="font-serif text-3xl text-[#1E3A32] text-center mb-12">Available Services</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {signatureProducts.map((product, i) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="bg-white border border-[#E4D9C4] hover:border-[#6E4F7D] hover:shadow-md transition-all flex flex-col"
                >
                  <div className="p-6 flex flex-col flex-1">
                    {product.tagline && (
                      <p className="text-[#6E4F7D] text-xs tracking-wider uppercase mb-2">{product.tagline}</p>
                    )}
                    <h3 className="font-serif text-xl text-[#1E3A32] mb-3 leading-snug">{product.name}</h3>
                    <p className="text-[#2B2725]/60 text-sm mb-4 flex-1">{product.short_description}</p>
                    {product.features?.length > 0 && (
                      <ul className="space-y-1.5 mb-5">
                        {product.features.slice(0, 3).map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-xs text-[#2B2725]/70">
                            <CheckCircle size={13} className="text-[#A6B7A3] flex-shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>
                    )}
                    <div className="flex items-center justify-between pt-4 border-t border-[#E4D9C4] mt-auto">
                      <span className="font-serif text-xl text-[#1E3A32]">
                        {product.price > 0 ? `$${(product.price / 100).toFixed(0)}` : "Free Consult"}
                      </span>
                      <Link
                        to={createPageUrl(product.slug ? `ProductPage?slug=${product.slug}` : "Consultations")}
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#6E4F7D] text-white text-sm hover:bg-[#5a3f68] transition-colors"
                      >
                        Learn More <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Work With Roberta */}
      <section className="py-20 bg-[#1E3A32] text-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <Sparkles size={36} className="text-[#D8B46B] mx-auto mb-4" />
            <h2 className="font-serif text-3xl md:text-4xl mb-4">Why Work Directly With Roberta?</h2>
            <p className="text-white/70 text-lg max-w-2xl mx-auto">
              Every signature service is personalized, evidence-informed, and delivered with care.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Star, title: "20+ Years of Experience", body: "Roberta brings deep expertise in hypnosis, emotional intelligence, and behavioral change." },
              { icon: Users, title: "Fully Personalized", body: "No templates. Every session is tailored specifically to your goals, history, and needs." },
              { icon: Heart, title: "Safe & Supportive", body: "A judgment-free space to do the inner work that creates lasting outer change." },
            ].map(({ icon: Icon, title, body }, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/10 p-6 border border-white/10"
              >
                <Icon size={28} className="text-[#D8B46B] mb-4" />
                <h3 className="font-serif text-xl mb-2">{title}</h3>
                <p className="text-white/70 text-sm leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#F9F5EF] text-center">
        <div className="max-w-xl mx-auto px-6">
          <h2 className="font-serif text-3xl text-[#1E3A32] mb-4">Ready to Begin?</h2>
          <p className="text-[#2B2725]/70 mb-8">
            Start with a free consultation — Roberta will help you find the right path for where you are right now.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={createPageUrl("Bookings")}>
              <Button className="bg-[#6E4F7D] text-white hover:bg-[#5a3f68] px-8 py-3 text-base">
                Book a Consultation
                <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
            <Link to={createPageUrl("Contact")}>
              <Button variant="outline" className="border-[#6E4F7D] text-[#6E4F7D] hover:bg-[#6E4F7D] hover:text-white px-8 py-3 text-base">
                Ask a Question
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}