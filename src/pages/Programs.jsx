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
import CmsText from "../components/cms/CmsText";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";

export default function Programs() {
  // Fetch published products from database
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["published-products"],
    queryFn: async () => {
      const all = await base44.entities.Product.filter({ status: "published" }, "display_order");
      return all;
    },
  });

  // Fetch published webinars
  const { data: webinars = [] } = useQuery({
    queryKey: ["published-webinars"],
    queryFn: async () => {
      const all = await base44.entities.Webinar.filter({ status: "published" }, "-created_date");
      return all;
    },
  });

  // Filter products by subtype and linkage
  const courses = products.filter(p => p.related_course_id);
  const books = products.filter(p => p.product_subtype === "book");
  const webinarProducts = products.filter(p => p.product_subtype === "webinar");

  // Group products by category
  const productsByCategory = {
    foundation: products.filter(p => p.category === "foundation"),
    mid_level: products.filter(p => p.category === "mid_level"),
    high_touch: products.filter(p => p.category === "high_touch"),
    advanced: products.filter(p => p.category === "advanced"),
  };

  const formatPrice = (price, billing_interval) => {
    const dollars = (price / 100).toFixed(2);
    if (billing_interval === "monthly") return `$${dollars}/mo`;
    if (billing_interval === "yearly") return `$${dollars}/yr`;
    return `$${dollars}`;
  };
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
              <CmsText 
                contentKey="programs.hero.subtitle" 
                page="Programs"
                blockTitle="Hero Subtitle"
                fallback="Programs & Pricing" 
                contentType="short_text"
              />
            </span>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-[#1E3A32] leading-tight mb-6">
              <CmsText 
                contentKey="programs.hero.title" 
                page="Programs"
                blockTitle="Hero Title"
                fallback="Your Mind Stylist Programs" 
                contentType="short_text"
              />
            </h1>
            <p className="text-[#2B2725]/80 text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto mb-8">
              <CmsText 
                contentKey="programs.hero.description" 
                page="Programs"
                blockTitle="Hero Description"
                fallback="Find your next step, whether you're just beginning or ready for deep transformation." 
                contentType="rich_text"
              />
            </p>
            
            {/* Primary CTA */}
            <Link
              to={createPageUrl("Bookings")}
              className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-[#D8B46B] text-[#1E3A32] text-sm font-semibold tracking-wide hover:bg-[#C5A35B] transition-all duration-300 shadow-lg"
            >
              <CmsText 
                contentKey="programs.hero.cta_experience" 
                page="Programs"
                blockTitle="Hero Experience CTA"
                fallback="Experience Hypnosis with Roberta" 
                contentType="short_text"
              />
              <ArrowRight size={16} />
            </Link>
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
            <div className="text-[#2B2725]/80 text-lg leading-relaxed max-w-3xl mx-auto">
              <CmsText 
                contentKey="programs.intro.content" 
                page="Programs"
                blockTitle="Intro Content"
                fallback="<p class='mb-6'><strong class='text-[#1E3A32]'>Your Mind Stylist offers transformational pathways for every phase of your inner journey.</strong></p><p class='mb-6'>From introductory tools that help you clear mental clutter to high-touch coaching that reshapes your emotional operating system — choose what aligns with you today.</p><p class='text-[#1E3A32] font-serif text-xl italic mt-8'>Every program below is designed to help you understand yourself better, shift patterns with awareness, and build emotional resilience that lasts.</p>" 
                contentType="rich_text"
              />
            </div>
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
              <CmsText 
                contentKey="programs.path.title" 
                page="Programs"
                blockTitle="Path Section Title"
                fallback="Choose Your Path" 
                contentType="short_text"
              />
            </h2>

            {/* Tier 1 — Foundations & Everyday Support */}
            {productsByCategory.foundation.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center gap-3 mb-8">
                  <Zap size={28} className="text-[#D8B46B]" />
                  <h3 className="font-serif text-2xl md:text-3xl text-[#1E3A32]">
                    Tier 1 — Foundations & Everyday Support
                  </h3>
                </div>
                <p className="text-[#2B2725]/70 mb-8">Entry-level offerings (low commitment, high accessibility)</p>

                <div className="grid md:grid-cols-3 gap-6">
                  {productsByCategory.foundation.map((product) => (
                    <div
                      key={product.id}
                      className={`bg-white p-8 border transition-all ${
                        product.ui_group === "hero"
                          ? "border-2 border-[#D8B46B] relative"
                          : "border border-[#E4D9C4] hover:border-[#D8B46B]"
                      }`}
                    >
                      {product.ui_group === "hero" && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D8B46B] px-4 py-1 text-xs text-[#1E3A32] tracking-wide uppercase">
                          Popular
                        </div>
                      )}
                      <h4 className="font-serif text-xl text-[#1E3A32] mb-3">{product.name}</h4>
                      {product.tagline && (
                        <p className="text-[#2B2725]/60 text-sm mb-4">{product.tagline}</p>
                      )}
                      <p className="text-[#2B2725]/70 text-sm mb-4">{product.short_description}</p>
                      <p className="text-2xl font-bold text-[#1E3A32] mb-6">
                        {formatPrice(product.price, product.billing_interval)}
                      </p>
                      <Link to={product.slug ? createPageUrl(`ProductPage?slug=${product.slug}`) : createPageUrl("PurchaseCenter")}>
                        <Button
                          className={`w-full ${
                            product.ui_group === "hero"
                              ? "bg-[#D8B46B] text-[#1E3A32] hover:bg-[#1E3A32] hover:text-[#F9F5EF]"
                              : "bg-[#1E3A32] hover:bg-[#2B2725]"
                          }`}
                        >
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tier 2 — Mid-Level Learning */}
            {productsByCategory.mid_level.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center gap-3 mb-8">
                  <BookOpen size={28} className="text-[#6E4F7D]" />
                  <h3 className="font-serif text-2xl md:text-3xl text-[#1E3A32]">
                    Tier 2 — Mid-Level Learning
                  </h3>
                </div>
                <p className="text-[#2B2725]/70 mb-8">More structured, self-paced learning designed for deeper change</p>

                <div className="grid md:grid-cols-2 gap-6">
                  {productsByCategory.mid_level.map((product) => (
                    <div
                      key={product.id}
                      className={
                        product.ui_group === "featured"
                          ? "bg-[#6E4F7D] text-white p-8 relative"
                          : "bg-white p-8 border border-[#E4D9C4]"
                      }
                    >
                      {product.ui_group === "featured" && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D8B46B] px-4 py-1 text-xs text-[#1E3A32] tracking-wide uppercase">
                          Best Value
                        </div>
                      )}
                      <h4
                        className={`font-serif text-xl mb-3 ${
                          product.ui_group === "featured" ? "text-white" : "text-[#1E3A32]"
                        }`}
                      >
                        {product.name}
                      </h4>
                      {product.tagline && (
                        <p
                          className={`text-sm mb-4 ${
                            product.ui_group === "featured" ? "text-white/90" : "text-[#2B2725]/60"
                          }`}
                        >
                          {product.tagline}
                        </p>
                      )}
                      <p
                        className={`text-sm mb-4 ${
                          product.ui_group === "featured" ? "text-white/90" : "text-[#2B2725]/70"
                        }`}
                      >
                        {product.short_description}
                      </p>
                      <p
                        className={`text-3xl font-bold mb-6 ${
                          product.ui_group === "featured" ? "text-white" : "text-[#1E3A32]"
                        }`}
                      >
                        {formatPrice(product.price, product.billing_interval)}
                      </p>
                      <Link to={product.slug ? createPageUrl(`ProductPage?slug=${product.slug}`) : createPageUrl("PurchaseCenter")}>
                        <Button
                          className={`w-full ${
                            product.ui_group === "featured"
                              ? "bg-[#D8B46B] text-[#1E3A32] hover:bg-white"
                              : "bg-[#1E3A32] hover:bg-[#2B2725]"
                          }`}
                        >
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tier 3 — Group/one-on-one */}
            {productsByCategory.high_touch.length > 0 && (
              <div className="mb-20">
                <div className="flex items-center gap-3 mb-8">
                  <Users size={28} className="text-[#A6B7A3]" />
                  <h3 className="font-serif text-2xl md:text-3xl text-[#1E3A32]">
                    Tier 3 — Group/one-on-one
                  </h3>
                </div>
                <p className="text-[#2B2725]/70 mb-8">Work with Roberta more directly — small group or 1:1 support</p>

                <div className="grid md:grid-cols-2 gap-6">
                  {productsByCategory.high_touch.map((product) => (
                    <div
                      key={product.id}
                      className={
                        product.ui_group === "featured"
                          ? "bg-gradient-to-br from-[#1E3A32] to-[#2B2725] text-white p-8 relative"
                          : "bg-white p-8 border border-[#E4D9C4]"
                      }
                    >
                      {product.ui_group === "featured" && (
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#D8B46B] px-4 py-1 text-xs text-[#1E3A32] tracking-wide uppercase">
                          Premium
                        </div>
                      )}
                      <h4
                        className={`font-serif text-xl mb-3 ${
                          product.ui_group === "featured" ? "text-white" : "text-[#1E3A32]"
                        }`}
                      >
                        {product.name}
                      </h4>
                      {product.tagline && (
                        <p
                          className={`text-sm mb-4 ${
                            product.ui_group === "featured" ? "text-white/90" : "text-[#2B2725]/60"
                          }`}
                        >
                          {product.tagline}
                        </p>
                      )}
                      <p
                        className={`text-sm mb-4 ${
                          product.ui_group === "featured" ? "text-white/90" : "text-[#2B2725]/70"
                        }`}
                      >
                        {product.short_description}
                      </p>
                      <p
                        className={`text-3xl font-bold mb-6 ${
                          product.ui_group === "featured" ? "text-white" : "text-[#1E3A32]"
                        }`}
                      >
                        {formatPrice(product.price, product.billing_interval)}
                      </p>
                      <Link to={product.slug ? createPageUrl(`ProductPage?slug=${product.slug}`) : createPageUrl("PurchaseCenter")}>
                        <Button
                          className={`w-full ${
                            product.ui_group === "featured"
                              ? "bg-[#D8B46B] text-[#1E3A32] hover:bg-white"
                              : "bg-[#1E3A32] hover:bg-[#2B2725]"
                          }`}
                        >
                          Get Started
                        </Button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Category Cards - Courses */}
            {courses.length > 0 && (
              <div className="mb-12">
                <Link to={createPageUrl("ProgramsCourses")}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-[#6E4F7D] to-[#8B659B] text-white p-8 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <BookOpen size={32} className="text-white" />
                          <h3 className="font-serif text-3xl">Courses & Training</h3>
                        </div>
                        <p className="text-white/90 text-lg mb-4">
                          Comprehensive learning programs to master Mind Styling techniques
                        </p>
                        <p className="text-white/80 text-sm">
                          {courses.length} {courses.length === 1 ? 'course' : 'courses'} available • View all pricing and details
                        </p>
                      </div>
                      <ArrowRight size={28} className="text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all" />
                    </div>
                  </motion.div>
                </Link>
              </div>
            )}

            {/* Category Cards - Books */}
            {books.length > 0 && (
              <div className="mb-12">
                <Link to={createPageUrl("ProgramsBooks")}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-[#D8B46B] to-[#C5A35B] text-[#1E3A32] p-8 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <BookOpen size={32} />
                          <h3 className="font-serif text-3xl">Books & Resources</h3>
                        </div>
                        <p className="text-[#1E3A32]/90 text-lg mb-4">
                          Deep dives and practical guides for your transformation journey
                        </p>
                        <p className="text-[#1E3A32]/80 text-sm">
                          {books.length} {books.length === 1 ? 'book' : 'books'} available • View all pricing and details
                        </p>
                      </div>
                      <ArrowRight size={28} className="text-[#1E3A32]/60 group-hover:text-[#1E3A32] group-hover:translate-x-2 transition-all" />
                    </div>
                  </motion.div>
                </Link>
              </div>
            )}

            {/* Category Cards - Webinars */}
            {(webinars.length > 0 || webinarProducts.length > 0) && (
              <div className="mb-12">
                <Link to={createPageUrl("ProgramsWebinars")}>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="bg-gradient-to-br from-[#1E3A32] to-[#2B4A40] text-white p-8 cursor-pointer group"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                          <Sparkles size={32} className="text-[#D8B46B]" />
                          <h3 className="font-serif text-3xl">Webinars & Live Events</h3>
                        </div>
                        <p className="text-white/90 text-lg mb-4">
                          Join live sessions and workshops for real-time learning
                        </p>
                        <p className="text-white/80 text-sm">
                          {webinars.length + webinarProducts.length} {webinars.length + webinarProducts.length === 1 ? 'event' : 'events'} available • View all pricing and details
                        </p>
                      </div>
                      <ArrowRight size={28} className="text-white/60 group-hover:text-white group-hover:translate-x-2 transition-all" />
                    </div>
                  </motion.div>
                </Link>
              </div>
            )}

            {/* Advanced Opportunities */}
            <div>
              <div className="flex items-center gap-3 mb-8">
                <Crown size={28} className="text-[#D8B46B]" />
                <h3 className="font-serif text-2xl md:text-3xl text-[#1E3A32]">
                  Advanced Opportunities
                </h3>
              </div>
              <p className="text-[#2B2725]/70 mb-8">Build mastery and expand your transformational reach</p>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Hypnosis Training */}
                <div className="bg-white p-8 border border-[#E4D9C4]">
                  <h4 className="font-serif text-xl text-[#1E3A32] mb-3">
                    Hypnosis Training
                  </h4>
                  <p className="text-[#2B2725]/70 text-sm mb-4">
                    Full training for professional practice
                  </p>
                  <p className="text-xl font-medium text-[#D8B46B] mb-6">Contact for Pricing</p>
                  <Link to={createPageUrl("LearnHypnosis")}>
                    <Button variant="outline" className="w-full border-[#1E3A32] text-[#1E3A32] hover:bg-[#1E3A32] hover:text-white">
                      Learn More & Join Waitlist
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
                  <p className="text-xl font-medium text-[#D8B46B] mb-6">Contact for Pricing</p>
                  <Link to={createPageUrl("Bookings")}>
                   <Button variant="outline" className="w-full border-[#1E3A32] text-[#1E3A32] hover:bg-[#1E3A32] hover:text-white">
                     Book Consultation
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
              <CmsText 
                contentKey="programs.choose.title" 
                page="Programs"
                blockTitle="How To Choose Title"
                fallback="How to Choose What's Right" 
                contentType="short_text"
              />
            </h2>

            <p className="text-[#2B2725]/80 text-lg text-center mb-10">
              <CmsText 
                contentKey="programs.choose.subtitle" 
                page="Programs"
                blockTitle="How To Choose Subtitle"
                fallback="Not sure what to start with?" 
                contentType="short_text"
              />
            </p>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <div className="bg-[#F9F5EF] p-6 border-l-4 border-[#D8B46B]">
                <p className="text-[#2B2725]/80 mb-2">New to this world?</p>
                <p className="font-serif text-xl text-[#1E3A32]">Pocket Mindset™ is the perfect gentle entry.</p>
              </div>

              <div className="bg-[#F9F5EF] p-6 border-l-4 border-[#6E4F7D]">
                <p className="text-[#2B2725]/80 mb-2">Want structured learning with tangible skills?</p>
                <p className="font-serif text-xl text-[#1E3A32]">LENS™ is your foundation.</p>
              </div>

              <div className="bg-[#F9F5EF] p-6 border-l-4 border-[#A6B7A3]">
                <p className="text-[#2B2725]/80 mb-2">You want community + live support?</p>
                <p className="font-serif text-xl text-[#1E3A32]">Salon Group delivers that.</p>
              </div>

              <div className="bg-[#F9F5EF] p-6 border-l-4 border-[#1E3A32]">
                <p className="text-[#2B2725]/80 mb-2">You want the deepest transformation?</p>
                <p className="font-serif text-xl text-[#1E3A32]">Private one-to-one work is for you.</p>
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
              <CmsText 
                contentKey="programs.pricing.title" 
                page="Programs"
                blockTitle="Pricing Title"
                fallback="Pricing Philosophy & Support" 
                contentType="short_text"
              />
            </h2>

            <p className="text-[#2B2725]/80 text-lg leading-relaxed mb-8">
              <CmsText 
                contentKey="programs.pricing.intro" 
                page="Programs"
                blockTitle="Pricing Intro"
                fallback="At Your Mind Stylist, we price for:" 
                contentType="short_text"
              />
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
              <CmsText 
                contentKey="programs.pricing.offer_intro" 
                page="Programs"
                blockTitle="Pricing Offer Intro"
                fallback="We also offer:" 
                contentType="short_text"
              />
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
              <CmsText 
                contentKey="programs.cta.title" 
                page="Programs"
                blockTitle="CTA Title"
                fallback="Ready to Begin?" 
                contentType="short_text"
              />
            </h2>

            <div className="grid md:grid-cols-3 gap-4">
              {isLoading ? (
                <div className="col-span-3 text-center text-[#F9F5EF]/70">Loading products...</div>
              ) : (
                <>
                  {/* Dynamically render published products for the CTA section */}
                  {products
                    .filter(p => p.ui_group === "hero" || p.ui_group === "featured")
                    .slice(0, 5)
                    .map((product) => (
                      <Link key={product.id} to={product.slug ? createPageUrl(`ProductPage?slug=${product.slug}`) : createPageUrl("PurchaseCenter")}>
                        <Button className="w-full h-full bg-[#D8B46B] text-[#1E3A32] hover:bg-[#F9F5EF] py-6 flex flex-col items-center justify-center gap-2">
                          <span className="text-sm font-normal">{product.name}</span>
                          <span className="text-lg font-bold">{formatPrice(product.price, product.billing_interval)}</span>
                        </Button>
                      </Link>
                    ))
                  }
                  
                  {/* Fallback if no featured products - show link to Purchase Center */}
                  {products.filter(p => p.ui_group === "hero" || p.ui_group === "featured").length === 0 && (
                    <Link to={createPageUrl("PurchaseCenter")} className="col-span-3">
                      <Button className="w-full bg-[#D8B46B] text-[#1E3A32] hover:bg-[#F9F5EF] py-6">
                        <span className="text-lg font-bold">View All Programs</span>
                      </Button>
                    </Link>
                  )}
                </>
              )}
            </div>

            <div className="text-center mt-12">
              <p className="text-[#F9F5EF]/70 mb-4">
                <CmsText 
                  contentKey="programs.cta.question" 
                  page="Programs"
                  blockTitle="CTA Question"
                  fallback="Still have questions?" 
                  contentType="short_text"
                />
              </p>
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