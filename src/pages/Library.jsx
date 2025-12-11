import React, { useState, useEffect } from "react";
import SEO from "../components/SEO";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Layers, Sparkles, Play, BookOpen, Headphones, CheckCircle, Lock, ArrowRight } from "lucide-react";

export default function Library() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
      setLoading(false);
    };
    init();
  }, []);

  // Mock purchased content - in production, fetch from DB/Stripe
  const userAccess = {
    certification: false,
    innerRehearsal: false,
    masterclass: true, // Everyone gets free masterclass
  };

  const collections = [
    {
      id: "certification",
      icon: Layers,
      title: "The Mind Styling Certification™",
      description: "Your complete 3-phase journey: Edit → Tailor → Design",
      progress: 0,
      totalLessons: 30,
      completedLessons: 0,
      link: createPageUrl("Dashboard"), // Will link to actual course player
      color: "#1E3A32",
      hasAccess: userAccess.certification,
      purchaseLink: createPageUrl("CertPurchase")
    },
    {
      id: "inner-rehearsal",
      icon: Headphones,
      title: "Inner Rehearsal Sessions™",
      description: "Guided audio sessions for calm, clarity, and identity shifts",
      sessionCount: 24,
      newThisMonth: 3,
      link: createPageUrl("Dashboard"), // Will link to audio library
      color: "#A6B7A3",
      hasAccess: userAccess.innerRehearsal,
      purchaseLink: createPageUrl("InnerRehearsalPurchase")
    },
    {
      id: "masterclass",
      icon: Play,
      title: "Imposter Syndrome & Other Myths to Ditch",
      description: "Free on-demand masterclass",
      duration: "45 minutes",
      watched: false,
      link: createPageUrl("Masterclass"),
      color: "#D8B46B",
      hasAccess: userAccess.masterclass,
      isFree: true
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F9F5EF] flex items-center justify-center">
        <p className="text-[#2B2725]/60">Loading your library...</p>
      </div>
    );
  }

  const accessibleContent = collections.filter(c => c.hasAccess);
  const lockedContent = collections.filter(c => !c.hasAccess);

  return (
    <div className="min-h-screen bg-[#F9F5EF] pt-32 pb-24">
      <SEO
        title="Your Library | Your Mind Stylist"
        description="Access your programs, courses, and Inner Rehearsal Sessions in one place."
        canonical="/library"
      />
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen size={32} className="text-[#D8B46B]" />
              <h1 className="font-serif text-3xl md:text-4xl text-[#1E3A32]">
                Your Library
              </h1>
            </div>
            <p className="text-[#2B2725]/70 text-lg">
              Everything you need for your mind styling journey — in one place.
            </p>
          </div>

          {/* Accessible Content */}
          {accessibleContent.length > 0 && (
            <section className="mb-16">
              <h2 className="text-[#2B2725]/60 text-xs uppercase tracking-wide mb-6">
                Your Programs
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accessibleContent.map((collection, index) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link
                      to={collection.link}
                      className="block bg-white p-8 hover:shadow-xl transition-all duration-300 group h-full"
                    >
                      {/* Icon */}
                      <div
                        className="w-16 h-16 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"
                        style={{ backgroundColor: `${collection.color}15` }}
                      >
                        <collection.icon size={32} style={{ color: collection.color }} />
                      </div>

                      {/* Content */}
                      <h3 className="font-serif text-xl text-[#1E3A32] mb-2 group-hover:text-[#D8B46B] transition-colors">
                        {collection.title}
                      </h3>
                      <p className="text-[#2B2725]/70 text-sm mb-6">
                        {collection.description}
                      </p>

                      {/* Stats */}
                      {collection.id === "certification" && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-xs text-[#2B2725]/60 mb-2">
                            <span>Progress</span>
                            <span>{collection.completedLessons} / {collection.totalLessons} lessons</span>
                          </div>
                          <div className="w-full h-2 bg-[#E4D9C4] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#D8B46B] transition-all duration-500"
                              style={{ width: `${collection.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {collection.id === "inner-rehearsal" && (
                        <div className="flex items-center gap-4 text-sm text-[#2B2725]/70 mb-4">
                          <span>{collection.sessionCount} sessions</span>
                          {collection.newThisMonth > 0 && (
                            <span className="px-2 py-1 bg-[#D8B46B]/20 text-[#D8B46B] text-xs uppercase tracking-wide">
                              {collection.newThisMonth} New
                            </span>
                          )}
                        </div>
                      )}

                      {collection.id === "masterclass" && (
                        <div className="flex items-center gap-2 text-sm text-[#2B2725]/70 mb-4">
                          {collection.watched ? (
                            <CheckCircle size={16} className="text-[#A6B7A3]" />
                          ) : (
                            <Play size={16} className="text-[#D8B46B]" />
                          )}
                          <span>{collection.duration}</span>
                        </div>
                      )}

                      {/* CTA */}
                      <div className="flex items-center gap-2 text-[#1E3A32] group-hover:text-[#D8B46B] font-medium transition-colors">
                        <span>Continue</span>
                        <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Locked Content */}
          {lockedContent.length > 0 && (
            <section>
              <h2 className="text-[#2B2725]/60 text-xs uppercase tracking-wide mb-6">
                Available to Purchase
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {lockedContent.map((collection, index) => (
                  <motion.div
                    key={collection.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: (accessibleContent.length + index) * 0.1 }}
                    className="bg-white p-8 relative overflow-hidden"
                  >
                    {/* Lock Overlay */}
                    <div className="absolute top-4 right-4">
                      <div className="w-10 h-10 rounded-full bg-[#2B2725]/5 flex items-center justify-center">
                        <Lock size={18} className="text-[#2B2725]/40" />
                      </div>
                    </div>

                    {/* Icon */}
                    <div
                      className="w-16 h-16 rounded-full flex items-center justify-center mb-6 opacity-40"
                      style={{ backgroundColor: `${collection.color}15` }}
                    >
                      <collection.icon size={32} style={{ color: collection.color }} />
                    </div>

                    {/* Content */}
                    <h3 className="font-serif text-xl text-[#1E3A32] mb-2">
                      {collection.title}
                    </h3>
                    <p className="text-[#2B2725]/70 text-sm mb-6">
                      {collection.description}
                    </p>

                    {/* CTA */}
                    <Link
                      to={collection.purchaseLink}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all"
                    >
                      Learn More
                      <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Empty State */}
          {accessibleContent.length === 0 && (
            <div className="bg-white p-12 text-center">
              <div className="w-20 h-20 rounded-full bg-[#D8B46B]/20 flex items-center justify-center mx-auto mb-6">
                <BookOpen size={32} className="text-[#D8B46B]" />
              </div>
              <h2 className="font-serif text-2xl text-[#1E3A32] mb-3">
                Your library is ready for you.
              </h2>
              <p className="text-[#2B2725]/70 mb-8 max-w-md mx-auto">
                Start with the free masterclass, or explore programs designed to help you restyle your mind from the inside out.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to={createPageUrl("Masterclass")}
                  className="px-8 py-4 bg-[#1E3A32] text-[#F9F5EF] text-sm tracking-wide hover:bg-[#2B2725] transition-all"
                >
                  Watch Free Masterclass
                </Link>
                <Link
                  to={createPageUrl("PurchaseCenter")}
                  className="px-8 py-4 border border-[#D8B46B] text-[#1E3A32] text-sm tracking-wide hover:bg-[#D8B46B]/10 transition-all"
                >
                  Browse Programs
                </Link>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}