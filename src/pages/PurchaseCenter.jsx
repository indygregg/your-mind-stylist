import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Layers, Sparkles, Play, User, Check, ArrowRight, ShoppingCart, ExternalLink, Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

export default function PurchaseCenter() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("full");

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

  // Check user's certification access (you can expand this to check actual purchase records)
  const hasCertificationAccess = user?.certification_access === true;

  const handleCertificationPurchase = async (paymentType) => {
    setCheckoutLoading(true);
    try {
      const response = await base44.functions.invoke('createCertificationCheckout', {
        payment_type: paymentType
      });

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.error('Failed to create checkout session');
        setCheckoutLoading(false);
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('Something went wrong. Please try again.');
      setCheckoutLoading(false);
    }
  };

  const certificationProduct = {
    id: "cert",
    icon: Layers,
    title: "The Mind Styling Certification™",
    tagline: "3-Part Inner Redesign",
    description: "Full certification program with lifetime access",
    openLink: "/app/library",
    type: "course",
    color: "#1E3A32",
    hasAccess: hasCertificationAccess
  };

  const products = [
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
      <SEO
        title="Purchase Center | Your Mind Stylist"
        description="Explore and purchase programs, subscriptions, and services."
        canonical="/purchase-center"
      />
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

          {/* Certification - Special Treatment */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className={`bg-white p-8 md:p-10 relative overflow-hidden mb-8 ${
              certificationProduct.hasAccess ? "border-2 border-[#A6B7A3]" : ""
            }`}
          >
            {certificationProduct.hasAccess && (
              <div className="absolute top-4 right-4 px-3 py-1 bg-[#A6B7A3] text-white text-xs uppercase tracking-wide">
                Purchased
              </div>
            )}

            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
              style={{ backgroundColor: `${certificationProduct.color}15` }}
            >
              <certificationProduct.icon size={32} style={{ color: certificationProduct.color }} />
            </div>

            <h2 className="font-serif text-2xl md:text-3xl text-[#1E3A32] mb-2">
              {certificationProduct.title}
            </h2>
            <p className="text-[#2B2725]/60 text-sm uppercase tracking-wide mb-4">
              {certificationProduct.tagline}
            </p>
            <p className="text-[#2B2725]/80 mb-6">
              {certificationProduct.description}
            </p>

            {certificationProduct.hasAccess ? (
              <Link
                to={certificationProduct.openLink}
                className="group w-full px-6 py-4 bg-[#1E3A32] text-[#F9F5EF] text-center text-sm tracking-wide hover:bg-[#2B2725] transition-all duration-300 flex items-center justify-center gap-2"
              >
                Open Program
                <ExternalLink size={16} />
              </Link>
            ) : (
              <Tabs value={selectedPlan} onValueChange={setSelectedPlan} className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="full">Full Pay</TabsTrigger>
                  <TabsTrigger value="payment_plan_3">3 Months</TabsTrigger>
                  <TabsTrigger value="payment_plan_6">6 Months</TabsTrigger>
                </TabsList>

                <TabsContent value="full" className="space-y-4">
                  <div className="bg-[#F9F5EF] p-6 mb-4">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="font-serif text-4xl text-[#1E3A32]">$1,995</span>
                      <span className="text-[#2B2725]/60">one-time</span>
                    </div>
                    <p className="text-[#A6B7A3] text-sm font-medium">Best value - Save $102</p>
                  </div>
                  <Button
                    onClick={() => handleCertificationPurchase('full')}
                    disabled={checkoutLoading}
                    className="w-full bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF] py-6 text-lg"
                  >
                    {checkoutLoading && selectedPlan === 'full' ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ShoppingCart size={20} className="mr-2" />
                        Purchase Full Program
                      </>
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="payment_plan_3" className="space-y-4">
                  <div className="bg-[#F9F5EF] p-6 mb-4">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="font-serif text-4xl text-[#1E3A32]">$699</span>
                      <span className="text-[#2B2725]/60">/ month × 3</span>
                    </div>
                    <p className="text-[#2B2725]/60 text-sm">Total: $2,097</p>
                  </div>
                  <Button
                    onClick={() => handleCertificationPurchase('payment_plan_3')}
                    disabled={checkoutLoading}
                    className="w-full bg-[#D8B46B] hover:bg-[#C9A55A] text-[#1E3A32] py-6 text-lg"
                  >
                    {checkoutLoading && selectedPlan === 'payment_plan_3' ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Start 3-Month Plan'
                    )}
                  </Button>
                </TabsContent>

                <TabsContent value="payment_plan_6" className="space-y-4">
                  <div className="bg-[#F9F5EF] p-6 mb-4">
                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="font-serif text-4xl text-[#1E3A32]">$365</span>
                      <span className="text-[#2B2725]/60">/ month × 6</span>
                    </div>
                    <p className="text-[#2B2725]/60 text-sm">Total: $2,190</p>
                  </div>
                  <Button
                    onClick={() => handleCertificationPurchase('payment_plan_6')}
                    disabled={checkoutLoading}
                    className="w-full bg-[#D8B46B] hover:bg-[#C9A55A] text-[#1E3A32] py-6 text-lg"
                  >
                    {checkoutLoading && selectedPlan === 'payment_plan_6' ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      'Start 6-Month Plan'
                    )}
                  </Button>
                </TabsContent>
              </Tabs>
            )}
          </motion.div>

          {/* Other Products Grid */}
          <div className="grid md:grid-cols-2 gap-8">
            {products.map((product) => {
              const hasAccess = product.type === "free";

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
                  {product.type === "service" ? (
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
                  ) : product.type === "subscription" ? (
                    <div className="space-y-3">
                      <p className="text-sm text-[#2B2725]/60 text-center">Coming Soon</p>
                    </div>
                  ) : null}
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