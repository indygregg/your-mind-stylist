import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Layers, Sparkles, BookOpen, Calendar, Play, User, Edit3 } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "../utils";
import OnboardingModal from "../components/onboarding/OnboardingModal";
import PaymentFailureBanner from "../components/purchase/PaymentFailureBanner";
import { base44 } from "@/api/base44Client";
import EmotionalWeather from "@/components/studio/EmotionalWeather";
import DailyPocketPrompt from "@/components/studio/DailyPocketPrompt";
import ConstellationMap from "@/components/studio/ConstellationMap";
import InnerMomentumMeter from "@/components/studio/InnerMomentumMeter";
import NotesDrawer from "@/components/studio/NotesDrawer";
import RecommendationCard from "@/components/studio/RecommendationCard";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [subscriptionStatus, setSubscriptionStatus] = useState(null);
  const [studioStats, setStudioStats] = useState(null);
  const [dailyPrompt, setDailyPrompt] = useState(null);
  const [notesDrawerOpen, setNotesDrawerOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await base44.auth.me();
        setUser(currentUser);
        
        // Auto-assign manager role if applicable
        if (currentUser && currentUser.email === 'roberta@robertafernandez.com' && currentUser.role === 'user') {
          await base44.functions.invoke('autoAssignManagerRole', {});
          window.location.reload();
        }
        
        // Fetch studio stats
        const stats = await base44.functions.invoke('getStudioStats', {});
        setStudioStats(stats.data);
        
        // Fetch daily prompt
        const prompts = await base44.entities.DailyPrompt.filter({ active: true });
        if (prompts.length > 0) {
          const today = new Date().getDate();
          setDailyPrompt(prompts[today % prompts.length]);
        }
        
        // Track app session
        await base44.functions.invoke('trackEvent', {
          event_type: 'app_session',
          points: 1
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const handleUpdatePayment = () => {
    // TODO: Open Stripe billing portal
    // window.location.href = billingPortalUrl;
    console.log("Opening billing portal...");
  };
  const programs = [
    {
      icon: Layers,
      title: "The Mind Styling Certification™",
      status: "Not Enrolled",
      color: "#1E3A32",
    },
    {
      icon: Sparkles,
      title: "The Inner Rehearsal Sessions™",
      status: "Not Enrolled",
      color: "#A6B7A3",
    },
  ];

  return (
    <div className="bg-[#F9F5EF] min-h-screen pt-32 pb-24">
      {user && <OnboardingModal role="user" />}
      <NotesDrawer
        isOpen={notesDrawerOpen}
        onClose={() => setNotesDrawerOpen(false)}
        sourceType="freeform"
      />
      
      <div className="max-w-6xl mx-auto px-6">
        <PaymentFailureBanner 
          status={subscriptionStatus}
          onUpdatePayment={handleUpdatePayment}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Welcome Header */}
          <div className="mb-12">
            <span className="text-[#D8B46B] text-xs tracking-[0.3em] uppercase mb-4 block">
              Welcome Back
            </span>
            <h1 className="font-serif text-3xl md:text-4xl text-[#1E3A32]">
              Your Mind Styling Studio
            </h1>
          </div>

          {/* Mind Styling Studio Hub */}
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <EmotionalWeather sentiment={studioStats?.sentiment} />
            <DailyPocketPrompt 
              prompt={dailyPrompt?.prompt_text}
              onCreateNote={() => setNotesDrawerOpen(true)}
            />
          </div>

          {/* Constellation & Momentum */}
          <div className="grid lg:grid-cols-2 gap-6 mb-12">
            <ConstellationMap totalPoints={studioStats?.constellation?.totalPoints || 0} />
            <InnerMomentumMeter weeklyPoints={studioStats?.momentum?.weeklyPoints || 0} />
          </div>

          {/* Programs */}
          <div className="mb-12">
            <h2 className="font-serif text-xl text-[#1E3A32] mb-6">Your Programs</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {programs.map((program) => (
                <div
                  key={program.title}
                  className="bg-white p-8 border-l-4"
                  style={{ borderColor: program.color }}
                >
                  <program.icon size={32} style={{ color: program.color }} className="mb-4" />
                  <h3 className="font-serif text-xl text-[#1E3A32] mb-2">{program.title}</h3>
                  <span className="inline-block px-3 py-1 bg-[#E4D9C4] text-[#2B2725]/70 text-sm rounded-full">
                    {program.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Resources */}
          <div>
            <h2 className="font-serif text-xl text-[#1E3A32] mb-6">Quick Links</h2>
            <div className="grid md:grid-cols-4 gap-4">
              {[
                { label: "Explore Programs", page: "WorkWithMe", icon: Layers },
                { label: "Free Masterclass", page: "FreeMasterclass", icon: Play },
                { label: "Read Blog", page: "Blog", icon: BookOpen },
                { label: "Account Settings", page: "Contact", icon: User },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={createPageUrl(link.page)}
                  className="bg-white p-4 flex items-center gap-3 hover:shadow-md transition-shadow"
                >
                  <link.icon size={18} className="text-[#D8B46B]" />
                  <span className="text-[#1E3A32] text-sm">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}