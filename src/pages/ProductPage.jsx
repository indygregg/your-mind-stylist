import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, ArrowRight, ShoppingCart, Loader2, Star } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ProductPage() {
  const [slug, setSlug] = useState("");
  const [isPreview, setIsPreview] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setSlug(urlParams.get("slug") || "");
    setIsPreview(urlParams.get("preview") === "true");
  }, []);

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["product", slug],
    queryFn: () => {
      if (isPreview) {
        return base44.entities.Product.filter({ slug });
      }
      return base44.entities.Product.filter({ slug, status: "published" });
    },
    enabled: !!slug,
  });

  const product = products[0];

  const handlePurchase = async () => {
    setCheckoutLoading(true);
    try {
      const response = await base44.functions.invoke('createProductCheckout', {
        product_id: product.id,
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

  const formatPrice = (price, billing_interval) => {
    if (!price) return "Free";
    const dollars = (price / 100).toFixed(2);
    if (billing_interval === "monthly") return `$${dollars}/mo`;
    if (billing_interval === "yearly") return `$${dollars}/yr`;
    return `$${dollars}`;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <Loader2 className="animate-spin text-[#D8B46B]" size={32} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-[#1E3A32] mb-4">Product Not Found</h1>
          <Link to={createPageUrl("Programs")} className="text-[#D8B46B] hover:underline">
            View All Programs
          </Link>
        </div>
      </div>
    );
  }

  // Render different templates
  if (product.template_choice === "minimal") {
    return (
      <div className="bg-[#F9F5EF] min-h-screen pt-32 pb-24">
        <SEO
          title={`${product.name} | Your Mind Stylist`}
          description={product.short_description}
          canonical={`/product?slug=${product.slug}`}
        />
        {isPreview && (
          <div className="fixed top-0 left-0 right-0 bg-[#D8B46B] text-[#1E3A32] text-center py-3 z-50 font-medium">
            Preview Mode - This page is not yet published
          </div>
        )}
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-serif text-4xl md:text-5xl text-[#1E3A32] mb-4">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-[#D8B46B] text-lg mb-6">{product.tagline}</p>
            )}
            <p className="text-[#2B2725]/80 text-lg mb-8 max-w-2xl mx-auto">
              {product.short_description}
            </p>

            <div className="inline-block bg-white p-8 mb-8">
              <div className="font-serif text-5xl text-[#1E3A32] mb-2">
                {formatPrice(product.price, product.billing_interval)}
              </div>
              {product.type === "subscription" && (
                <p className="text-[#D8B46B] text-sm">Cancel anytime</p>
              )}
            </div>

            <Button
              onClick={handlePurchase}
              disabled={checkoutLoading}
              className="bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF] px-12 py-6 text-lg"
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <ShoppingCart size={20} className="mr-2" />
                  Purchase Now
                </>
              )}
            </Button>

            {product.features && product.features.length > 0 && (
              <div className="mt-16 text-left">
                <h2 className="font-serif text-2xl text-[#1E3A32] mb-6 text-center">
                  What's Included
                </h2>
                <div className="space-y-3 max-w-xl mx-auto">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check size={20} className="text-[#A6B7A3] mt-1 flex-shrink-0" />
                      <span className="text-[#2B2725]/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    );
  }

  if (product.template_choice === "immersive") {
    return (
      <div className="bg-[#1E3A32] min-h-screen">
        <SEO
          title={`${product.name} | Your Mind Stylist`}
          description={product.short_description}
          canonical={`/product?slug=${product.slug}`}
        />
        {isPreview && (
          <div className="fixed top-0 left-0 right-0 bg-[#D8B46B] text-[#1E3A32] text-center py-3 z-50 font-medium">
            Preview Mode - This page is not yet published
          </div>
        )}
        {/* Hero */}
        <section className="pt-32 pb-20 px-6">
          <div className="max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 bg-[#D8B46B]/20">
                <Star size={16} className="text-[#D8B46B]" />
                <span className="text-[#D8B46B] text-sm tracking-wider uppercase">
                  {product.tagline || "Premium Program"}
                </span>
              </div>
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl text-[#F9F5EF] leading-tight mb-8">
                {product.name}
              </h1>
              <p className="text-[#F9F5EF]/80 text-xl mb-12 max-w-3xl mx-auto">
                {product.short_description}
              </p>

              <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
                <div className="bg-[#D8B46B] px-8 py-4 text-[#1E3A32]">
                  <div className="font-serif text-4xl mb-1">
                    {formatPrice(product.price, product.billing_interval)}
                  </div>
                  {product.type === "subscription" && (
                    <div className="text-sm">Cancel anytime</div>
                  )}
                </div>
                <Button
                  onClick={handlePurchase}
                  disabled={checkoutLoading}
                  className="bg-[#F9F5EF] hover:bg-white text-[#1E3A32] px-10 py-6 text-lg"
                >
                  {checkoutLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    <>
                      Begin Your Journey
                      <ArrowRight size={20} className="ml-2" />
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Description */}
        {product.long_description && (
          <section className="py-20 bg-[#F9F5EF]">
            <div className="max-w-4xl mx-auto px-6">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: product.long_description }}
              />
            </div>
          </section>
        )}

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <section className="py-20 bg-white">
            <div className="max-w-5xl mx-auto px-6">
              <h2 className="font-serif text-4xl text-[#1E3A32] mb-12 text-center">
                Everything You'll Receive
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {product.features.map((feature, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.1 }}
                    className="flex items-start gap-4"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#D8B46B]/20 flex items-center justify-center flex-shrink-0">
                      <Check size={16} className="text-[#D8B46B]" />
                    </div>
                    <span className="text-[#2B2725]/80 text-lg">{feature}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="py-20 bg-[#1E3A32] text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-serif text-4xl text-[#F9F5EF] mb-6">
              Ready to Begin?
            </h2>
            <Button
              onClick={handlePurchase}
              disabled={checkoutLoading}
              className="bg-[#D8B46B] hover:bg-[#C9A55A] text-[#1E3A32] px-12 py-6 text-lg"
            >
              {checkoutLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Purchase {product.name}
                  <ArrowRight size={20} className="ml-2" />
                </>
              )}
            </Button>
          </div>
        </section>
      </div>
    );
  }

  // Default: Detailed Template
  return (
    <div className="bg-[#F9F5EF] min-h-screen pt-32 pb-24">
      <SEO
        title={`${product.name} | Your Mind Stylist`}
        description={product.short_description}
        canonical={`/product?slug=${product.slug}`}
      />
      {isPreview && (
        <div className="fixed top-0 left-0 right-0 bg-[#D8B46B] text-[#1E3A32] text-center py-3 z-50 font-medium">
          Preview Mode - This page is not yet published
        </div>
      )}
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-12 mb-16">
          {/* Left: Details */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
              {product.category === "foundation" && "Tier 1: Foundation"}
              {product.category === "mid_level" && "Tier 2: Mid-Level"}
              {product.category === "high_touch" && "Tier 3: High-Touch"}
              {product.category === "advanced" && "Advanced"}
            </span>
            <h1 className="font-serif text-4xl md:text-5xl text-[#1E3A32] mb-4">
              {product.name}
            </h1>
            {product.tagline && (
              <p className="text-[#D8B46B] text-xl mb-6">{product.tagline}</p>
            )}
            <p className="text-[#2B2725]/80 text-lg mb-8">
              {product.short_description}
            </p>

            {product.long_description && (
              <div
                className="prose prose-lg mb-8"
                dangerouslySetInnerHTML={{ __html: product.long_description }}
              />
            )}

            {product.features && product.features.length > 0 && (
              <div className="mb-8">
                <h2 className="font-serif text-2xl text-[#1E3A32] mb-4">
                  What's Included
                </h2>
                <div className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <Check size={20} className="text-[#A6B7A3] mt-1 flex-shrink-0" />
                      <span className="text-[#2B2725]/80">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Right: Purchase Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-white p-8 sticky top-32">
              <div className="text-center mb-8">
                <div className="font-serif text-5xl text-[#1E3A32] mb-2">
                  {formatPrice(product.price, product.billing_interval)}
                </div>
                {product.type === "subscription" && (
                  <p className="text-[#D8B46B] text-sm">Cancel anytime</p>
                )}
              </div>

              <Button
                onClick={handlePurchase}
                disabled={checkoutLoading}
                className="w-full bg-[#1E3A32] hover:bg-[#2B2725] text-[#F9F5EF] py-6 text-lg mb-4"
              >
                {checkoutLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} className="mr-2" />
                    Purchase Now
                  </>
                )}
              </Button>

              <p className="text-center text-[#2B2725]/60 text-sm mb-6">
                Secure checkout powered by Stripe
              </p>

              <div className="border-t border-[#E4D9C4] pt-6">
                <h3 className="font-medium text-[#1E3A32] mb-3">
                  Quick Facts
                </h3>
                <div className="space-y-2 text-sm text-[#2B2725]/70">
                  <div className="flex justify-between">
                    <span>Type:</span>
                    <span className="font-medium text-[#1E3A32]">
                      {product.type === "one_time" && "One-Time Purchase"}
                      {product.type === "subscription" && "Subscription"}
                      {product.type === "payment_plan" && "Payment Plan"}
                      {product.type === "bundle" && "Bundle"}
                    </span>
                  </div>
                  {product.billing_interval !== "one_time" && (
                    <div className="flex justify-between">
                      <span>Billing:</span>
                      <span className="font-medium text-[#1E3A32] capitalize">
                        {product.billing_interval}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link
                  to={createPageUrl("Contact")}
                  className="text-[#D8B46B] text-sm hover:underline"
                >
                  Have questions? Contact us
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}