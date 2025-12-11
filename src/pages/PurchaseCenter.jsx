import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Layers, Sparkles, Play, User, Check, ArrowRight, ShoppingCart, ExternalLink } from "lucide-react";

export default function PurchaseCenter() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  // Set auth layout
  if (typeof window !== 'undefined') {
    window.__USE_AUTH_LAYOUT = true;
  }

  // Mock data - in production, fetch from your DB/Stripe
  const userPurchases = [
    // Example: { productId: "cert", purchased: true, subscribed: false }
  ];

  const hasPurchased = (productId) => {
    return userPurchases.some(p => p.productId === productId && p.purchased);
  };

  const isSubscribed = (productId) => {
    return userPurchases.some(p => p.productId === productId && p.subscribed);
  };

  const products = [
    {
      id: "cert",
      icon: Layers,
      title: "The Mind Styling Certification™",
      tagline: "3-Part Inner Redesign",
      description: "Full certification program with lifetime access",
      price: "$1,995",
      paymentPlan: "or 4 payments of $525",
      openLink: "/app/library",
      type: "course",
      color: "#1E3A32"
    },
    {
      id: "inner-rehearsal",
      icon: Sparkles,
      title: "Inner Rehearsal Sessions™",
      tagline: "Audio Library Subscription",
      description: "Access to all guided sessions + new monthly releases",
      priceMonthly: "$29/mo",
      priceYearly: "$299/yr",
      openLink: "/app/library",
      type: "subscription",
      color: "#A6B7A3"
    },
    {
      id: "masterclass",
      icon: Play,
      title: "Imposter Syndrome Masterclass",
      tagline: "Free On-Demand",
      description: "Watch the full masterclass anytime",
      price: "Free",
      openLink: createPageUrl("FreeMasterclass"),
      type: "free",
      color: "#D8B46B"
    },
    {
      id: "private",
      icon: User,
      title: "Private Mind Styling",
      tagline: "1:1 Consultation",
      description: "Book a private session with Roberta",
      price: "$250",
      priceNote: "per session",
      openLink: createPageUrl("Contact?type=private"),
      type: "service",
      color: "#6E4F7D"
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <p className="text-[#2B2725]/60">Loading your programs...</p>
      </div>
    );
  }

  return (
    <div className="bg-[#F9F5EF] min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-12">
            <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
              Purchase Center
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-4">
              Your Programs & Subscriptions
            </h1>
            <p className="text-[#2B2725]/70 text-lg">
              Manage your access, upgrade your subscription, or explore new programs.
            </p>
          </div>

          {/* Products Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product) => {
              const purchased = hasPurchased(product.id);
              const subscribed = isSubscribed(product.id);
              const hasAccess = purchased || subscribed || product.type === "free";

              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`bg-white p-8 md:p-10 relative overflow-hidden ${
                    hasAccess ? "border-2 border-[#A6B7A3]" : ""
                  }`}
                >
                  {/* Access Badge */}
                  {hasAccess && (
                    <div className="absolute top-4 right-4 px-3 py-1 bg-[#A6B7A3] text-white text-xs uppercase tracking-wide">
                      {subscribed ? "Active" : "Purchased"}
                    </div>
                  )}

                  {/* Icon */}
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
                    style={{ backgroundColor: `${product.color}15` }}
                  >
                    <product.icon size={32} style={{ color: product.color }} />
                  </div>

                  {/* Content */}
                  <h2 className="font-serif text-2xl md:text-3xl text-[#1E3A32] mb-2">
                    {product.title}
                  </h2>
                  <p className="text-[#2B2725]/60 text-sm uppercase tracking-wide mb-4">
                    {product.tagline}
                  </p>
                  <p className="text-[#2B2725]/80 mb-6">
                    {product.description}
                  </p>

                  {/* Pricing */}
                  {!hasAccess && (
                    <div className="mb-6 pb-6 border-b border-[#E4D9C4]">
                      {product.priceMonthly ? (
                        <div>
                          <div className="flex items-baseline gap-3 mb-2">
                            <span className="font-serif text-2xl text-[#1E3A32]">{product.priceMonthly}</span>
                            <span className="text-[#2B2725]/60 text-sm">or</span>
                            <span className="font-serif text-2xl text-[#1E3A32]">{product.priceYearly}</span>
                          </div>
                          <p className="text-[#D8B46B] text-sm">Save $49 with annual plan</p>
                        </div>
                      ) : (
                        <div>
                          <div className="font-serif text-3xl text-[#1E3A32] mb-1">
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
                  )}

                  {/* CTA */}
                  {hasAccess ? (
                    <Link
                      to={product.openLink}
                      className="group w-full px-6 py-4 bg-[#1E3A32] text-[#F9F5EF] text-center text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      {product.type === "subscription" && "Open Library"}
                      {product.type === "course" && "Open Program"}
                      {product.type === "free" && "Watch Now"}
                      {product.type === "service" && "Request Session"}
                      <ExternalLink size={16} />
                    </Link>
                  ) : (
                    <div className="space-y-3">
                      {product.type === "subscription" ? (
                        <>
                          <button className="w-full px-6 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300">
                            Subscribe Monthly — {product.priceMonthly}
                          </button>
                          <button className="w-full px-6 py-4 bg-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#E4D9C4] transition-all duration-300">
                            Subscribe Yearly — {product.priceYearly}
                          </button>
                        </>
                      ) : product.type === "service" ? (
                        <Link
                          to={product.openLink}
                          className="block w-full px-6 py-4 bg-[#1E3A32] text-[#F9F5EF] text-center text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
                        >
                          Request Consultation
                        </Link>
                      ) : product.type === "free" ? (
                        <Link
                          to={product.openLink}
                          className="block w-full px-6 py-4 bg-[#1E3A32] text-[#F9F5EF] text-center text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300"
                        >
                          Access Free Masterclass
                        </Link>
                      ) : (
                        <button className="w-full px-6 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300 flex items-center justify-center gap-2">
                          <ShoppingCart size={16} />
                          Purchase Now — {product.price}
                        </button>
                      )}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Help Section */}
          <div className="mt-16 bg-white p-8 text-center">
            <h3 className="font-serif text-2xl text-[#1E3A32] mb-4">
              Need Help Choosing?
            </h3>
            <p className="text-[#2B2725]/70 mb-6">
              Not sure which path is right for you? Schedule a complimentary consultation.
            </p>
            <Link
              to={createPageUrl("Contact")}
              className="inline-flex items-center gap-2 px-8 py-4 border border-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#D8B46B]/10 transition-all duration-300"
            >
              Schedule Consultation
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}