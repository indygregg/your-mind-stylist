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
  const [recommendations, setRecommendations] = useState([]);

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
        
        // Track app session and streak
        await base44.functions.invoke('trackEvent', {
          event_type: 'app_session',
          points: 1
        });
        
        await base44.functions.invoke('trackStreak', {
          action_type: 'dashboard_visited'
        });
        
        // Fetch personalized recommendations
        const recs = await base44.functions.invoke('getRecommendations', {});
        if (recs?.data?.recommendations) {
          setRecommendations(recs.data.recommendations);
        }
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
      title: "The Mind Styling Evolution™",
      status: "Not Enrolled",
      color: "#1E3A32",
    },
    {
      icon: Sparkles,
      title: "Pocket Visualization™",
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
            <h1 className="font-serif text-3xl md:text-4xl text-[#1E3A32] mb-3">
              The Mind Styling Studio™
            </h1>
            <p className="text-[#2B2725]/60 italic">
              Here's what's unfolding in your inner world today.
            </p>
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

          {/* Personalized Recommendations */}
          {recommendations.length > 0 && (
            <div className="mb-12">
              <h2 className="font-serif text-2xl text-[#1E3A32] mb-6">Suggested For You</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {recommendations.map((rec, index) => (
                  <RecommendationCard 
                    key={index} 
                    recommendation={rec}
                    onTakeAction={(prompt) => {
                      setDailyPrompt({ prompt_text: prompt });
                      setNotesDrawerOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Programs */}
          <div className="mb-12">
            <h2 className="font-serif text-xl text-[#1E3A32] mb-6">Your Programs</h2>
            {programs.length === 0 ? (
              <div className="bg-white p-8 text-center">
                <p className="text-[#2B2725]/70 leading-relaxed">
                  You haven't added any programs yet. When you're ready, you can begin with{" "}
                  <Link to={createPageUrl("PocketVisualization")} className="text-[#D8B46B] hover:underline">
                    Pocket Visualization™
                  </Link>{" "}
                  or explore the Mind Style Toolkit.
                </p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {programs.map((program) => (
                  <div
                    key={program.title}
                    className="bg-white p-8 border-l-4"
                    style={{ borderColor: program.color }}
                  >
                    <program.icon size={32} style={{ color: program.color }} className="mb-4" />
                    <h3 className="font-serif text-xl text-[#1E3A32] mb-3">{program.title}</h3>
                    <span className="inline-block px-3 py-1 bg-[#E4D9C4] text-[#2B2725]/70 text-sm rounded-full mb-4">
                      {program.status}
                    </span>
                    <div className="mt-4">
                      <button className="text-[#1E3A32] text-sm font-medium hover:text-[#D8B46B] transition-colors">
                        Learn More →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Links */}
          <div>
            <h2 className="font-serif text-xl text-[#1E3A32] mb-6">Quick Links</h2>
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { label: "Explore Programs", page: "Programs", icon: Layers, description: "Discover your next step." },
                { label: "Pocket Visualization™", page: "PocketVisualization", icon: Sparkles, description: "Daily emotional reset tools." },
                { label: "Notes", page: "StudioNotes", icon: Edit3, description: "Capture insights as you learn." },
                { label: "Free Masterclass", page: "FreeMasterclass", icon: Play, description: "Watch anytime." },
                { label: "Read Blog", page: "Blog", icon: BookOpen, description: "Articles and insights." },
                { label: "Account Settings", page: "StudioSettings", icon: User, description: "Manage your profile." },
              ].map((link) => (
                <Link
                  key={link.label}
                  to={createPageUrl(link.page)}
                  className="bg-white p-4 hover:shadow-md transition-shadow flex flex-col gap-2"
                >
                  <link.icon size={20} className="text-[#D8B46B]" />
                  <span className="text-[#1E3A32] text-sm font-medium">{link.label}</span>
                  <span className="text-[#2B2725]/60 text-xs">{link.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}