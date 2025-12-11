import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import { Brain, Sparkles, User, ArrowRight, CheckCircle, Lightbulb } from "lucide-react";

export default function Masterclass() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const currentUser = await base44.auth.me();
      setUser(currentUser);
    };
    init();
  }, []);

  const noticePoints = [
    "When the imposter feeling shows up",
    "The stories that trigger it",
    "What thoughts and emotions accompany it",
    "The pressure or expectations you're holding",
    "Moments where you downplay or dismiss yourself"
  ];

  const nextSteps = [
    {
      icon: Brain,
      title: "The Mind Styling Certification™",
      description: "A complete program to edit, tailor, and design your mental operating system",
      cta: "Explore the Certification",
      link: "Certification"
    },
    {
      icon: Sparkles,
      title: "Inner Rehearsal Sessions™",
      description: "Guided audio sessions to reset your mind and rehearse your future self",
      cta: "Browse Sessions",
      link: "InnerRehearsal"
    },
    {
      icon: User,
      title: "Private Mind Styling",
      description: "1:1 custom work with Roberta for personalized transformation",
      cta: "Learn About Private Work",
      link: "PrivateSessions"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F9F5EF] py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Message */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
            Free Masterclass
          </span>
          <h1 className="font-serif text-4xl md:text-5xl text-[#1E3A32] mb-4">
            Imposter Syndrome
            <br />
            <span className="italic text-[#D8B46B]">& Other Myths to Ditch</span>
          </h1>
          {user && (
            <p className="text-[#2B2725]/70">
              Welcome, {user.full_name}. You're in the right place.
            </p>
          )}
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Video */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Video Player */}
              <div className="aspect-video bg-[#2B2725] mb-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#1E3A32]/50 to-[#6E4F7D]/30" />
                <div className="relative z-10 text-center">
                  <p className="text-[#F9F5EF]/80 mb-4">Video player will be integrated here</p>
                  <p className="text-[#F9F5EF]/60 text-sm">
                    (Integration with video hosting service pending)
                  </p>
                </div>
              </div>

              {/* Summary */}
              <div className="bg-white p-8">
                <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">About This Masterclass</h2>
                <div className="space-y-4 text-[#2B2725]/80 leading-relaxed">
                  <p>
                    In this session, we explore what's really happening beneath imposter syndrome —
                    the emotional patterns, the stories about worth, and the expectations that keep you
                    stuck in a cycle of self-doubt.
                  </p>
                  <p>
                    You'll learn why high performers and leaders are especially vulnerable to this
                    feeling, how your mind creates narratives about competence and belonging, and
                    practical ways to interrupt the imposter loop when it shows up.
                  </p>
                  <p>
                    This isn't about forcing confidence or "faking it." It's about understanding your
                    patterns so you can finally trust your own abilities — without needing constant
                    external validation.
                  </p>
                </div>
              </div>

              {/* What to Notice */}
              <div className="bg-[#F9F5EF] p-8">
                <div className="flex items-start gap-4 mb-6">
                  <Lightbulb size={24} className="text-[#D8B46B] flex-shrink-0 mt-1" />
                  <div>
                    <h3 className="font-serif text-xl text-[#1E3A32] mb-2">
                      What to Notice After Watching
                    </h3>
                    <p className="text-[#2B2725]/70">
                      Over the next few days, pay attention to these patterns in your own experience:
                    </p>
                  </div>
                </div>
                <ul className="space-y-3">
                  {noticePoints.map((point, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <CheckCircle size={18} className="text-[#D8B46B] flex-shrink-0 mt-1" />
                      <span className="text-[#2B2725]/80">{point}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 pt-6 border-t border-[#E4D9C4]">
                  <p className="text-[#2B2725]/70 italic">
                    Awareness is always the first step. Simply noticing these patterns — without
                    judgment — is the beginning of transformation.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar: Next Steps */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#1E3A32] text-[#F9F5EF] p-8"
            >
              <h3 className="font-serif text-2xl mb-4">Ready to Go Deeper?</h3>
              <p className="text-[#F9F5EF]/80 mb-6 leading-relaxed">
                If this masterclass resonated with you, here are ways to continue your transformation:
              </p>

              <div className="space-y-6">
                {nextSteps.map((step, index) => (
                  <div key={index} className="border-t border-[#F9F5EF]/20 pt-6 first:border-t-0 first:pt-0">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-10 h-10 bg-[#D8B46B]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <step.icon size={20} className="text-[#D8B46B]" />
                      </div>
                      <div>
                        <h4 className="font-medium text-[#F9F5EF] mb-1">{step.title}</h4>
                        <p className="text-[#F9F5EF]/70 text-sm leading-relaxed mb-3">
                          {step.description}
                        </p>
                        <Link
                          to={createPageUrl(step.link)}
                          className="group inline-flex items-center gap-2 text-[#D8B46B] text-sm hover:gap-3 transition-all"
                        >
                          {step.cta}
                          <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Additional Resources */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white p-8"
            >
              <h3 className="font-medium text-[#1E3A32] mb-4">Questions or Need Support?</h3>
              <p className="text-[#2B2725]/70 text-sm mb-6">
                If you have questions about any of these offerings or want to discuss which path is
                right for you, reach out.
              </p>
              <Link
                to={createPageUrl("Contact")}
                className="group inline-flex items-center gap-2 text-[#1E3A32] font-medium hover:text-[#D8B46B] transition-colors"
              >
                Contact Roberta
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}